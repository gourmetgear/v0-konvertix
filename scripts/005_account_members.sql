-- Create account_members table for user advertising accounts
-- This table links users to their advertising accounts (Facebook, Google, etc.)
-- Run in Supabase SQL editor.

begin;

create table if not exists public.account_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id text not null,
  ad_account_id text,
  business_id text,
  ad_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.account_members enable row level security;

-- Create RLS policies for account_members
-- Users can only access their own account memberships
drop policy if exists "account_members_select_own" on public.account_members;
create policy "account_members_select_own"
  on public.account_members for select
  using (user_id = auth.uid());

drop policy if exists "account_members_insert_own" on public.account_members;
create policy "account_members_insert_own"
  on public.account_members for insert
  with check (user_id = auth.uid());

drop policy if exists "account_members_update_own" on public.account_members;
create policy "account_members_update_own"
  on public.account_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "account_members_delete_own" on public.account_members;
create policy "account_members_delete_own"
  on public.account_members for delete
  using (user_id = auth.uid());

-- Create indexes for better performance
create index if not exists account_members_user_id_idx on public.account_members(user_id);
create index if not exists account_members_account_id_idx on public.account_members(account_id);

-- Create unique constraint to prevent duplicate account_id per user
create unique index if not exists account_members_user_account_unique 
  on public.account_members(user_id, account_id);

commit;