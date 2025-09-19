-- Extend business_profiles table with missing attributes
-- Run in Supabase SQL editor

begin;

-- Product Information
alter table public.business_profiles
  add column if not exists product_type text,
  add column if not exists product_category text,
  add column if not exists main_products text,
  add column if not exists product_description text,
  add column if not exists unique_selling_proposition text,
  add column if not exists price_range text;

-- Business Model
alter table public.business_profiles
  add column if not exists business_model text,
  add column if not exists revenue_streams jsonb default '[]'::jsonb;

-- Market Analysis
alter table public.business_profiles
  add column if not exists target_market text,
  add column if not exists geographic_reach text,
  add column if not exists main_competitors text,
  add column if not exists competitive_advantage text,
  add column if not exists market_position text;

-- Customer Information
alter table public.business_profiles
  add column if not exists customer_demographics text,
  add column if not exists customer_pain_points text,
  add column if not exists customer_journey_stage text,
  add column if not exists average_customer_value numeric,
  add column if not exists customer_lifetime_value numeric;

commit;