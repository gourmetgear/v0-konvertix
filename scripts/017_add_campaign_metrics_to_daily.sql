-- Add campaign-specific metrics to metrics_daily table
-- This adds the missing columns for campaign-level tracking

begin;

-- Add campaign-specific columns to metrics_daily table
alter table public.metrics_daily
add column if not exists campaign_id text,
add column if not exists campaign_name text,
add column if not exists fb_ad_account_id text,
add column if not exists daily_budget decimal(12,2) default 0.00,
add column if not exists objective text,
add column if not exists status text,
add column if not exists channel text default 'facebook',
add column if not exists revenue decimal(12,2) default 0.00,
add column if not exists conversions integer default 0,
add column if not exists cpp decimal(8,4) default 0.0000; -- Cost per purchase

-- Add indexes for the new campaign columns
create index if not exists metrics_daily_campaign_id_idx on public.metrics_daily(campaign_id);
create index if not exists metrics_daily_campaign_name_idx on public.metrics_daily(campaign_name);
create index if not exists metrics_daily_fb_ad_account_idx on public.metrics_daily(fb_ad_account_id);
create index if not exists metrics_daily_status_idx on public.metrics_daily(status);

-- Create composite index for campaign-level queries
create index if not exists metrics_daily_campaign_metrics_idx
on public.metrics_daily(account_id, campaign_id, date desc)
include (spend, revenue, conversions, ctr, cpc, cpm, cpp, roas);

-- Create view for campaign-level aggregated metrics
create or replace view public.campaign_metrics_summary as
select
  account_id,
  user_id,
  campaign_id,
  campaign_name,
  fb_ad_account_id,
  channel,
  platform,
  objective,
  status,
  daily_budget,
  -- Aggregated metrics
  sum(spend) as total_spend,
  sum(revenue) as total_revenue,
  sum(conversions) as total_conversions,
  sum(impressions) as total_impressions,
  sum(clicks) as total_clicks,
  sum(reach) as total_reach,
  -- Calculated averages
  case
    when sum(spend) > 0 then
      (sum(revenue) / sum(spend))
    else 0
  end as avg_roas,
  case
    when sum(impressions) > 0 then
      (sum(spend) / sum(impressions) * 1000)
    else 0
  end as avg_cpm,
  case
    when sum(clicks) > 0 then
      (sum(spend) / sum(clicks))
    else 0
  end as avg_cpc,
  case
    when sum(impressions) > 0 then
      (sum(clicks)::decimal / sum(impressions)::decimal * 100)
    else 0
  end as avg_ctr,
  case
    when sum(conversions) > 0 then
      (sum(spend) / sum(conversions))
    else 0
  end as avg_cpp,
  -- Date range
  min(date) as first_date,
  max(date) as last_date,
  count(*) as reporting_days,
  max(created_at) as last_updated
from public.metrics_daily
where campaign_id is not null
group by
  account_id, user_id, campaign_id, campaign_name,
  fb_ad_account_id, channel, platform, objective, status, daily_budget;

-- Grant access to the view
alter view public.campaign_metrics_summary owner to postgres;

-- Add RLS policy for the view (inherits from metrics_daily policies)
-- Views automatically inherit RLS from the underlying table

commit;