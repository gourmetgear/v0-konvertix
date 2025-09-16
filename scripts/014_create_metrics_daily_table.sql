-- Create metrics_daily table for comprehensive Facebook Ads metrics
-- This matches the updated n8n workflow structure
-- Run in Supabase SQL editor.

begin;

-- Create metrics_daily table
create table if not exists public.metrics_daily (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id text not null,
  pixel_id text,
  platform text not null default 'facebook' check (platform in ('facebook', 'google', 'tiktok', 'snapchat')),
  
  -- Ad Performance Metrics
  impressions bigint default 0,
  clicks bigint default 0,
  spend decimal(12,2) default 0.00,
  cpm decimal(8,4) default 0.0000,
  cpc decimal(8,4) default 0.0000,
  ctr decimal(8,6) default 0.000000,
  frequency decimal(8,4) default 0.0000,
  reach bigint default 0,
  unique_clicks bigint default 0,
  
  -- Conversion Metrics
  total_conversions integer default 0,
  purchase_conversions integer default 0,
  lead_conversions integer default 0,
  registration_conversions integer default 0,
  add_to_cart_conversions integer default 0,
  initiate_checkout_conversions integer default 0,
  
  -- Revenue Metrics
  total_revenue decimal(12,2) default 0.00,
  purchase_revenue decimal(12,2) default 0.00,
  
  -- Cost Metrics
  cost_per_conversion decimal(10,2) default 0.00,
  cost_per_purchase decimal(10,2) default 0.00,
  cost_per_lead decimal(10,2) default 0.00,
  roas decimal(8,4) default 0.0000,
  
  -- Pixel/CAPI Metrics
  server_events integer default 0,
  browser_events integer default 0,
  matched_events integer default 0,
  match_rate decimal(8,6) default 0.000000,
  
  -- Campaign Breakdown
  active_campaigns integer default 0,
  active_adsets integer default 0,
  active_ads integer default 0,
  
  -- Meta fields
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  raw_data jsonb, -- Store full API response for debugging
  
  -- Ensure unique entries per day per account per platform
  unique(date, user_id, account_id, platform)
);

-- Enable Row Level Security
alter table public.metrics_daily enable row level security;

-- Create RLS policies - users can only access their own metrics
drop policy if exists "metrics_daily_select_own" on public.metrics_daily;
create policy "metrics_daily_select_own"
  on public.metrics_daily for select
  using (user_id = auth.uid());

drop policy if exists "metrics_daily_insert_own" on public.metrics_daily;
create policy "metrics_daily_insert_own"
  on public.metrics_daily for insert
  with check (user_id = auth.uid());

drop policy if exists "metrics_daily_update_own" on public.metrics_daily;
create policy "metrics_daily_update_own"
  on public.metrics_daily for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "metrics_daily_delete_own" on public.metrics_daily;
create policy "metrics_daily_delete_own"
  on public.metrics_daily for delete
  using (user_id = auth.uid());

-- Create indexes for better performance
create index if not exists metrics_daily_user_id_idx on public.metrics_daily(user_id);
create index if not exists metrics_daily_account_id_idx on public.metrics_daily(account_id);
create index if not exists metrics_daily_pixel_id_idx on public.metrics_daily(pixel_id);
create index if not exists metrics_daily_date_idx on public.metrics_daily(date desc);
create index if not exists metrics_daily_platform_idx on public.metrics_daily(platform);
create index if not exists metrics_daily_created_at_idx on public.metrics_daily(created_at desc);

-- Create composite indexes for common queries
create index if not exists metrics_daily_user_date_idx on public.metrics_daily(user_id, date desc);
create index if not exists metrics_daily_user_account_idx on public.metrics_daily(user_id, account_id, date desc);
create index if not exists metrics_daily_performance_idx on public.metrics_daily(user_id, platform, date desc) include (spend, total_revenue, total_conversions);

-- Create trigger to update updated_at timestamp
create or replace function update_metrics_daily_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_metrics_daily_updated_at on public.metrics_daily;
create trigger update_metrics_daily_updated_at
  before update on public.metrics_daily
  for each row execute function update_metrics_daily_updated_at();

-- Create view for weekly metrics
create or replace view public.metrics_weekly as
select 
  user_id,
  account_id,
  pixel_id,
  platform,
  date_trunc('week', date) as week_start,
  sum(impressions) as total_impressions,
  sum(clicks) as total_clicks,
  sum(spend) as total_spend,
  sum(total_conversions) as total_conversions,
  sum(total_revenue) as total_revenue,
  sum(server_events) as total_server_events,
  sum(matched_events) as total_matched_events,
  case 
    when sum(server_events) > 0 then 
      (sum(matched_events)::decimal / sum(server_events)::decimal)
    else 0 
  end as avg_match_rate,
  case 
    when sum(spend) > 0 then 
      (sum(total_revenue) / sum(spend))
    else 0 
  end as roas,
  case 
    when sum(total_conversions) > 0 then 
      (sum(spend) / sum(total_conversions))
    else 0 
  end as cost_per_conversion,
  case 
    when sum(impressions) > 0 then 
      (sum(clicks)::decimal / sum(impressions)::decimal * 100)
    else 0 
  end as ctr_percentage,
  count(*) as reporting_days,
  max(created_at) as last_updated
from public.metrics_daily
group by user_id, account_id, pixel_id, platform, date_trunc('week', date);

-- Create view for monthly metrics  
create or replace view public.metrics_monthly as
select 
  user_id,
  account_id,
  pixel_id,
  platform,
  date_trunc('month', date) as month_start,
  sum(impressions) as total_impressions,
  sum(clicks) as total_clicks,
  sum(spend) as total_spend,
  sum(total_conversions) as total_conversions,
  sum(total_revenue) as total_revenue,
  sum(server_events) as total_server_events,
  sum(matched_events) as total_matched_events,
  case 
    when sum(server_events) > 0 then 
      (sum(matched_events)::decimal / sum(server_events)::decimal)
    else 0 
  end as avg_match_rate,
  case 
    when sum(spend) > 0 then 
      (sum(total_revenue) / sum(spend))
    else 0 
  end as roas,
  case 
    when sum(total_conversions) > 0 then 
      (sum(spend) / sum(total_conversions))
    else 0 
  end as cost_per_conversion,
  case 
    when sum(impressions) > 0 then 
      (sum(clicks)::decimal / sum(impressions)::decimal * 100)
    else 0 
  end as ctr_percentage,
  count(*) as reporting_days,
  max(created_at) as last_updated
from public.metrics_daily
group by user_id, account_id, pixel_id, platform, date_trunc('month', date);

-- Grant access to views
alter view public.metrics_weekly owner to postgres;
alter view public.metrics_monthly owner to postgres;

-- Update capiconfig table to add sync tracking fields
alter table public.capiconfig 
add column if not exists is_active boolean default true,
add column if not exists last_sync_at timestamptz,
add column if not exists sync_status text default 'pending' check (sync_status in ('pending', 'success', 'error')),
add column if not exists last_error text;

-- Create index for active configs
create index if not exists capiconfig_active_idx on public.capiconfig(is_active, provider) where is_active = true;

commit;