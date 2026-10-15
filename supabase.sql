-- Run in Supabase SQL editor. Staff roles must be granted manually in the dashboard.
create table if not exists public.staff_members (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.appointments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 customer_name text not null, phone text not null, service_id integer not null check(service_id between 1 and 7),
 stylist_id text not null check(stylist_id in ('s1','s2','s3')),
 appointment_date date not null, appointment_time time not null,
 status text not null default 'Pending' check(status in ('Pending','Confirmed','Completed','Cancelled')),
 payment_status text not null default 'unpaid' check(payment_status in ('unpaid','pending','paid','failed')),
 created_at timestamptz not null default now()
);
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
alter table public.appointments enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.payments enable row level security;
-- Access is exclusively through the server using the service role, after JWT validation.
-- Do not create public RLS policies for these tables.
