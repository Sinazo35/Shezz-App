import {handleSecure,enabled as databaseEnabled} from './secure-api.mjs';
import {chatSupport as chat} from './chat-support.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||3000);
const sessions=new Map();
const hits=new Map();
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data))};
function limit(req){const ip=req.socket.remoteAddress||'unknown',now=Date.now(),v=hits.get(ip)||[];const recent=v.filter(t=>now-t<60000);recent.push(now);hits.set(ip,recent);return recent.length<=60}
function readBody(req){return new Promise((resolve,reject)=>{let s='';req.on('data',x=>{s+=x;if(s.length>10000){reject(new Error('Request too large'));req.destroy()}});req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch{reject(new Error('Invalid JSON'))}});req.on('error',reject)})}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
const dist=path.join(root,'dist');
http.createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');if(u.pathname.startsWith('/api/')){if(!limit(req))return send(res,429,{error:'Too many requests'});if(u.pathname==='/api/config'||u.pathname.startsWith('/api/v1/')){let body={};if(req.method==='POST'){try{body=await readBody(req)}catch{return send(res,400,{error:'Invalid request'})}}return await handleSecure(req,res,u.pathname,body)}if(req.method==='GET'&&u.pathname==='/api/health')return send(res,200,{ok:true,mode:databaseEnabled?'supabase':'demo',ai:!!process.env.OPENAI_API_KEY});if(req.method==='POST'&&u.pathname==='/api/chat'){try{const body=await readBody(req);if(typeof body.message!=='string'||!body.message.trim())return send(res,400,{error:'Message required'});return send(res,200,{reply:await chat(body.message)})}catch{return send(res,400,{error:'Invalid message'})}}return send(res,404,{error:'Not found'})}if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}let rel=decodeURIComponent(u.pathname);if(rel.includes('\0')||rel.split('/').includes('..')){res.writeHead(403);return res.end()}let file=path.join(dist,rel);if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403);return res.end()}try{if(!fs.statSync(file).isFile())file=path.join(dist,'index.html')}catch{file=path.join(dist,'index.html')}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Build missing. Run npm run build.')}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data)})}).listen(port,'0.0.0.0',()=>console.log(`SHEZZ listening on ${port}`));
