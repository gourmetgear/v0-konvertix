-- Create table for storing Facebook CAPI metrics
-- Run in Supabase SQL editor.

begin;

-- Create capi_metrics table
create table if not exists public.capi_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id text not null,
  pixel_id text not null,
  provider text not null default 'facebook' check (provider in ('facebook', 'google')),
  
  -- Time dimensions
  date_start date not null,
  date_stop date not null,
  fetch_date timestamptz not null default now(),
  
  -- Facebook CAPI specific metrics
  events_received integer default 0,
  events_matched integer default 0,
  match_rate decimal(5,4) default 0.0000, -- percentage as decimal (0.7500 = 75%)
  
  -- Event breakdown by type
  events_pageview integer default 0,
  events_purchase integer default 0,
  events_lead integer default 0,
  events_add_to_cart integer default 0,
  events_initiate_checkout integer default 0,
  events_complete_registration integer default 0,
  events_other integer default 0,
  
  -- Performance metrics
  total_revenue decimal(12,2) default 0.00,
  total_conversions integer default 0,
  cost_per_conversion decimal(10,2) default 0.00,
  
  -- Quality metrics
  event_source_quality jsonb, -- Store detailed quality breakdown
  server_events_count integer default 0,
  browser_events_count integer default 0,
  
  -- Raw data storage
  raw_response jsonb, -- Store full API response for debugging
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Ensure unique entries per day per pixel
  unique(user_id, account_id, pixel_id, date_start, date_stop)
);

-- Enable Row Level Security
alter table public.capi_metrics enable row level security;

-- Create RLS policies - users can only access their own metrics
drop policy if exists "capi_metrics_select_own" on public.capi_metrics;
create policy "capi_metrics_select_own"
  on public.capi_metrics for select
  using (user_id = auth.uid());

drop policy if exists "capi_metrics_insert_own" on public.capi_metrics;
create policy "capi_metrics_insert_own"
  on public.capi_metrics for insert
  with check (user_id = auth.uid());

drop policy if exists "capi_metrics_update_own" on public.capi_metrics;
create policy "capi_metrics_update_own"
  on public.capi_metrics for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "capi_metrics_delete_own" on public.capi_metrics;
create policy "capi_metrics_delete_own"
  on public.capi_metrics for delete
  using (user_id = auth.uid());

-- Create indexes for better performance
create index if not exists capi_metrics_user_id_idx on public.capi_metrics(user_id);
create index if not exists capi_metrics_account_id_idx on public.capi_metrics(account_id);
create index if not exists capi_metrics_pixel_id_idx on public.capi_metrics(pixel_id);
create index if not exists capi_metrics_date_idx on public.capi_metrics(date_start, date_stop);
create index if not exists capi_metrics_fetch_date_idx on public.capi_metrics(fetch_date);
create index if not exists capi_metrics_provider_idx on public.capi_metrics(provider);

-- Create composite index for common queries
create index if not exists capi_metrics_user_date_idx on public.capi_metrics(user_id, date_start desc);

-- Create trigger to update updated_at timestamp
create or replace function update_capi_metrics_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_capi_metrics_updated_at on public.capi_metrics;
create trigger update_capi_metrics_updated_at
  before update on public.capi_metrics
  for each row execute function update_capi_metrics_updated_at();

-- Create view for aggregated metrics
create or replace view public.capi_metrics_summary as
select 
  user_id,
  account_id,
  pixel_id,
  provider,
  date_trunc('month', date_start) as month,
  sum(events_received) as total_events_received,
  sum(events_matched) as total_events_matched,
  case 
    when sum(events_received) > 0 then 
      round((sum(events_matched)::decimal / sum(events_received)::decimal) * 100, 2)
    else 0 
  end as avg_match_rate_percentage,
  sum(total_conversions) as total_conversions,
  sum(total_revenue) as total_revenue,
  count(*) as reporting_days,
  max(fetch_date) as last_updated
from public.capi_metrics
group by user_id, account_id, pixel_id, provider, date_trunc('month', date_start);

-- Grant access to the view
alter view public.capi_metrics_summary owner to postgres;

commit;