-- User advertising accounts (Facebook, Google, etc.)
-- Run in Supabase SQL editor.

begin;

create table if not exists public.user_ad_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('facebook','google')),
  account_id text not null,
  business_id text,
  created_at timestamptz not null default now()
);

alter table public.user_ad_accounts enable row level security;

-- Each user can manage only their own rows
create policy if not exists "user_ad_accounts_select_own"
  on public.user_ad_accounts for select
  using (user_id = auth.uid());

create policy if not exists "user_ad_accounts_insert_own"
  on public.user_ad_accounts for insert
  with check (user_id = auth.uid());

create policy if not exists "user_ad_accounts_update_own"
  on public.user_ad_accounts for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy if not exists "user_ad_accounts_delete_own"
  on public.user_ad_accounts for delete
  using (user_id = auth.uid());

commit;

