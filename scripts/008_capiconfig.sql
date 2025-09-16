-- Create capiconfig table for Facebook Conversions API configurations
-- This table stores CAPI settings per advertising account
-- Run in Supabase SQL editor.

begin;

create table if not exists public.capiconfig (
  id uuid primary key default gen_random_uuid(),
  account_id text not null unique,
  pixel_id text,
  access_token text,
  domain text,
  events text[], -- Array of event names
  test_event_code text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.capiconfig enable row level security;

-- Create RLS policies for capiconfig
-- Users can only access CAPI configs for accounts they are members of
drop policy if exists "capiconfig_select_own_accounts" on public.capiconfig;
create policy "capiconfig_select_own_accounts"
  on public.capiconfig for select
  using (
    exists (
      select 1 from public.account_members am
      where am.account_id = capiconfig.account_id
      and am.user_id = auth.uid()
    )
  );

drop policy if exists "capiconfig_insert_own_accounts" on public.capiconfig;
create policy "capiconfig_insert_own_accounts"
  on public.capiconfig for insert
  with check (
    exists (
      select 1 from public.account_members am
      where am.account_id = capiconfig.account_id
      and am.user_id = auth.uid()
    )
  );

drop policy if exists "capiconfig_update_own_accounts" on public.capiconfig;
create policy "capiconfig_update_own_accounts"
  on public.capiconfig for update
  using (
    exists (
      select 1 from public.account_members am
      where am.account_id = capiconfig.account_id
      and am.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.account_members am
      where am.account_id = capiconfig.account_id
      and am.user_id = auth.uid()
    )
  );

drop policy if exists "capiconfig_delete_own_accounts" on public.capiconfig;
create policy "capiconfig_delete_own_accounts"
  on public.capiconfig for delete
  using (
    exists (
      select 1 from public.account_members am
      where am.account_id = capiconfig.account_id
      and am.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists capiconfig_account_id_idx on public.capiconfig(account_id);
create index if not exists capiconfig_last_verified_idx on public.capiconfig(last_verified_at);

commit;