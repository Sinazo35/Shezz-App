import crypto from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
const url=process.env.SUPABASE_URL, anon=process.env.SUPABASE_ANON_KEY, secret=process.env.SUPABASE_SERVICE_ROLE_KEY;
export const enabled=!!(url&&anon&&secret);
const admin=enabled?createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}}):null;
const publicConfig={enabled, supabaseUrl:enabled?url:null, supabaseAnonKey:enabled?anon:null, paymentsEnabled:!!(enabled&&process.env.PAYFAST_MERCHANT_ID&&process.env.PAYFAST_MERCHANT_KEY&&process.env.PUBLIC_BASE_URL)};
const reply=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
const fail=(res,status,message)=>reply(res,status,{error:message});
async function user(req){const match=/^Bearer (.+)$/i.exec(req.headers.authorization||'');if(!match)return null;const {data,error}=await admin.auth.getUser(match[1]);return error?null:data.user}
async function staff(id){const {data}=await admin.from('staff_members').select('user_id').eq('user_id',id).maybeSingle();return !!data}
const hash=code=>crypto.createHash('sha256').update(code).digest('hex');
export async function handleSecure(req,res,pathname,body){
 if(pathname==='/api/config'&&req.method==='GET')return reply(res,200,publicConfig);
 if(!pathname.startsWith('/api/v1/'))return false;
 if(!enabled)return fail(res,503,'Database is not configured. Set Supabase environment variables.');
 const actor=await user(req);if(!actor)return fail(res,401,'Sign in to continue.');
 const isStaff=await staff(actor.id);
 if(pathname==='/api/v1/me')return reply(res,200,{email:actor.email,staff:isStaff});
 if(pathname==='/api/v1/slots'&&req.method==='GET'){
   const u=new URL(req.url,'http://localhost'),date=u.searchParams.get('date'),stylist=u.searchParams.get('stylist');
   if(!/^\d{4}-\d\d-\d\d$/.test(date||'')||!['s1','s2','s3'].includes(stylist))return fail(res,400,'Invalid date or stylist');
   const {data,error}=await admin.from('appointments').select('appointment_time').eq('appointment_date',date).eq('stylist_id',stylist).neq('status','Cancelled');
   return error?fail(res,500,'Could not load availability'):reply(res,200,{reserved:(data||[]).map(x=>x.appointment_time.slice(0,5))});
 }
 if(pathname==='/api/v1/bookings'&&req.method==='GET'){
   let q=admin.from('appointments').select('*').order('created_at',{ascending:false}).limit(200);
   if(!isStaff)q=q.eq('user_id',actor.id);
   const {data,error}=await q;return error?fail(res,500,'Could not load bookings'):reply(res,200,{bookings:data});
 }
 if(pathname==='/api/v1/bookings'&&req.method==='POST'){
   const {name,phone,service,stylist,date,time}=body||{};
   if(typeof name!=='string'||name.trim().length<2||name.length>100||typeof phone!=='string'||!/^[+\d ()-]{9,22}$/.test(phone)||!Number.isInteger(service)||service<1||service>7||!['s1','s2','s3'].includes(stylist)||!/^\d{4}-\d\d-\d\d$/.test(date||'')||!/^\d\d:00$/.test(time||'')||Number(time.slice(0,2))<9||Number(time.slice(0,2))>16)return fail(res,400,'Invalid booking details');
   if(new Date(`${date}T${time}:00+02:00`).getTime()<=Date.now())return fail(res,400,'Choose a future time');
   const {data,error}=await admin.from('appointments').insert({user_id:actor.id,customer_name:name.trim(),phone,service_id:service,stylist_id:stylist,appointment_date:date,appointment_time:time}).select().single();
   if(error?.code==='23505')return fail(res,409,'This stylist is already booked at that time');
   return error?fail(res,500,'Could not save booking'):reply(res,201,{booking:data});
 }
 const statusMatch=/^\/api\/v1\/bookings\/([0-9a-f-]{36})\/status$/.exec(pathname);
 if(statusMatch&&req.method==='POST'){
   if(!isStaff)return fail(res,403,'Staff access required');
   if(!['Confirmed','Completed','Cancelled'].includes(body?.status))return fail(res,400,'Invalid status');
   const {data,error}=await admin.from('appointments').update({status:body.status}).eq('id',statusMatch[1]).select().single();
   return error?fail(res,400,'Unable to update appointment'):reply(res,200,{booking:data});
 }
 if(pathname==='/api/v1/rewards'&&req.method==='GET'){
   const {data:visits,error}=await admin.from('appointments').select('id').eq('user_id',actor.id).eq('status','Completed');
   const {data:used,error:e2}=await admin.from('reward_redemptions').select('id').eq('user_id',actor.id).not('redeemed_at','is',null);
   if(error||e2)return fail(res,500,'Unable to load rewards');
   return reply(res,200,{visits:visits.length,redeemed:used.length,eligible:visits.length>=3*(used.length+1)});
 }
 if(pathname==='/api/v1/rewards/issue'&&req.method==='POST'){
   const {data:visits}=await admin.from('appointments').select('id').eq('user_id',actor.id).eq('status','Completed');
   const {data:used}=await admin.from('reward_redemptions').select('id').eq('user_id',actor.id).not('redeemed_at','is',null);
   if((visits?.length||0)<3*((used?.length||0)+1))return fail(res,403,'Three completed visits required');
   const code=crypto.randomBytes(24).toString('base64url');
   const {error}=await admin.from('reward_redemptions').insert({user_id:actor.id,code_hash:hash(code),expires_at:new Date(Date.now()+10*60*1000).toISOString()});
   return error?fail(res,500,'Unable to issue reward'):reply(res,200,{code,expiresInSeconds:600});
 }
 if(pathname==='/api/v1/rewards/redeem'&&req.method==='POST'){
   if(!isStaff)return fail(res,403,'Staff access required');
   if(typeof body?.code!=='string'||body.code.length>200)return fail(res,400,'Invalid code');
   const {data:ticket}=await admin.from('reward_redemptions').select('*').eq('code_hash',hash(body.code)).is('redeemed_at',null).gt('expires_at',new Date().toISOString()).maybeSingle();
   if(!ticket)return fail(res,400,'Invalid, used or expired reward');
   const {data:visits}=await admin.from('appointments').select('id').eq('user_id',ticket.user_id).eq('status','Completed');
   const {data:used}=await admin.from('reward_redemptions').select('id').eq('user_id',ticket.user_id).not('redeemed_at','is',null);
   if((visits?.length||0)<3*((used?.length||0)+1))return fail(res,403,'Not enough completed visits');
   const {data,error}=await admin.from('reward_redemptions').update({redeemed_at:new Date().toISOString(),redeemed_by:actor.id}).eq('id',ticket.id).is('redeemed_at',null).select().maybeSingle();
   return error||!data?fail(res,409,'Already redeemed'):reply(res,200,{ok:true});
 }
 if(pathname==='/api/v1/payments/start')return fail(res,503,'PayFast checkout is not activated until merchant credentials and verified ITN webhook processing are configured. No payment has been taken.');
 return fail(res,404,'Unknown API endpoint');
}
