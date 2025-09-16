-- Fix capiconfig table structure
-- Run in Supabase SQL editor.

begin;

-- First, check if the table exists and what columns it has
-- If it exists but has wrong structure, we'll recreate it

-- Drop all policies first
drop policy if exists "capiconfig_select_own_accounts" on public.capiconfig;
drop policy if exists "capiconfig_insert_own_accounts" on public.capiconfig;
drop policy if exists "capiconfig_update_own_accounts" on public.capiconfig;
drop policy if exists "capiconfig_delete_own_accounts" on public.capiconfig;
drop policy if exists "capiconfig_select_own" on public.capiconfig;
drop policy if exists "capiconfig_insert_own" on public.capiconfig;
drop policy if exists "capiconfig_update_own" on public.capiconfig;
drop policy if exists "capiconfig_delete_own" on public.capiconfig;

-- Drop and recreate the table with correct structure
drop table if exists public.capiconfig cascade;

create table public.capiconfig (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id text not null,
  pixel_id text,
  access_token text,
  domain text,
  events text[], -- Array of event names
  test_event_code text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add unique constraint
alter table public.capiconfig add constraint capiconfig_user_account_unique unique(user_id, account_id);

-- Enable Row Level Security
alter table public.capiconfig enable row level security;

-- Simple RLS policies - users can only access their own CAPI configs
create policy "capiconfig_select_own"
  on public.capiconfig for select
  using (user_id = auth.uid());

create policy "capiconfig_insert_own"
  on public.capiconfig for insert
  with check (user_id = auth.uid());

create policy "capiconfig_update_own"
  on public.capiconfig for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "capiconfig_delete_own"
  on public.capiconfig for delete
  using (user_id = auth.uid());

-- Create indexes
create index capiconfig_user_id_idx on public.capiconfig(user_id);
create index capiconfig_account_id_idx on public.capiconfig(account_id);

commit;