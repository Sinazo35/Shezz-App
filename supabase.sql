-- Run in Supabase SQL editor. Staff roles must be granted manually in the dashboard.
create table if not exists public.customers (
 user_id uuid primary key references auth.users(id) on delete cascade,
 email text unique,
 full_name text,
 phone text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create or replace function public.sync_customer_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
 insert into public.customers as customer (user_id,email,full_name,phone)
 values (
  new.id,
  new.email,
  coalesce(nullif(new.raw_user_meta_data ->> 'full_name',''), nullif(new.raw_user_meta_data ->> 'name','')),
  coalesce(nullif(new.raw_user_meta_data ->> 'phone',''), new.phone)
 )
 on conflict (user_id) do update set
  email = excluded.email,
  full_name = coalesce(excluded.full_name, customer.full_name),
  phone = coalesce(excluded.phone, customer.phone),
  updated_at = now();
 return new;
end;
$$;

drop trigger if exists sync_customer_profile on auth.users;
create trigger sync_customer_profile
after insert or update on auth.users
for each row execute function public.sync_customer_from_auth();
revoke all on function public.sync_customer_from_auth() from public;

insert into public.customers (user_id,email,full_name,phone)
select
 id,
 email,
 coalesce(nullif(raw_user_meta_data ->> 'full_name',''), nullif(raw_user_meta_data ->> 'name','')),
 coalesce(nullif(raw_user_meta_data ->> 'phone',''), phone)
from auth.users
on conflict (user_id) do update set
 email = excluded.email,
 full_name = coalesce(excluded.full_name, public.customers.full_name),
 phone = coalesce(excluded.phone, public.customers.phone),
 updated_at = now();

create table if not exists public.staff_members (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.appointments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.customers(user_id) on delete cascade,
 customer_name text not null, phone text not null, service_id integer not null check(service_id between 1 and 7),
 stylist_id text not null check(stylist_id in ('s1','s2','s3')),
 appointment_date date not null, appointment_time time not null,
 status text not null default 'Pending' check(status in ('Pending','Confirmed','Completed','Cancelled')),
 payment_status text not null default 'unpaid' check(payment_status in ('unpaid','pending','paid','failed')),
 created_at timestamptz not null default now()
);
do $$
declare
 foreign_key record;
begin
 for foreign_key in
	select conname
	from pg_constraint
	where conrelid = 'public.appointments'::regclass
	 and contype = 'f'
	 and confrelid = 'auth.users'::regclass
 loop
	execute format('alter table public.appointments drop constraint %I', foreign_key.conname);
 end loop;

 if not exists (
	select 1
	from pg_constraint
	where conrelid = 'public.appointments'::regclass
	 and contype = 'f'
	 and confrelid = 'public.customers'::regclass
 ) then
	alter table public.appointments
	 add constraint appointments_user_id_fkey
	 foreign key (user_id) references public.customers(user_id) on delete cascade;
 end if;
end;
$$;
create or replace function public.sync_customer_from_appointment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
 update public.customers
 set full_name = new.customer_name,
  phone = new.phone,
  updated_at = now()
 where user_id = new.user_id;
 return new;
end;
$$;
drop trigger if exists sync_customer_booking on public.appointments;
create trigger sync_customer_booking
after insert or update of customer_name, phone, user_id on public.appointments
for each row execute function public.sync_customer_from_appointment();
revoke all on function public.sync_customer_from_appointment() from public;

create unique index if not exists appointment_slot_unique on public.appointments(stylist_id,appointment_date,appointment_time) where status <> 'Cancelled';
create table if not exists public.reward_redemptions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 code_hash text not null unique, expires_at timestamptz not null, redeemed_at timestamptz,
 redeemed_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(), appointment_id uuid not null references public.appointments(id),
 user_id uuid not null references auth.users(id), amount_cents integer not null check(amount_cents>0),
 status text not null default 'pending', provider_ref text unique, created_at timestamptz not null default now()
);
alter table public.staff_members enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.payments enable row level security;
-- Access is exclusively through the server using the service role, after JWT validation.
-- Do not create public RLS policies for these tables.
