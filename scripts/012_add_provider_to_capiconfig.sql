-- Add provider field to capiconfig table
-- Run in Supabase SQL editor.

begin;

-- Add provider column
alter table public.capiconfig 
add column if not exists provider text default 'facebook';

-- Add check constraint for valid providers
alter table public.capiconfig 
drop constraint if exists capiconfig_provider_check;

alter table public.capiconfig 
add constraint capiconfig_provider_check 
check (provider in ('facebook', 'google'));

-- Create index for provider
create index if not exists capiconfig_provider_idx on public.capiconfig(provider);

-- Add Google Ads specific columns
alter table public.capiconfig 
add column if not exists customer_id text, -- Google Ads customer ID
add column if not exists developer_token text, -- Google Ads developer token
add column if not exists refresh_token text, -- OAuth refresh token for Google
add column if not exists conversion_actions text[]; -- Google conversion action IDs

-- Update existing records to use appropriate field mapping
-- For Google Ads: pixel_id becomes customer_id, test_event_code becomes developer_token
comment on column public.capiconfig.pixel_id is 'Facebook Pixel ID or Google Ads Customer ID';
comment on column public.capiconfig.test_event_code is 'Facebook test event code or Google Ads developer token';

commit;