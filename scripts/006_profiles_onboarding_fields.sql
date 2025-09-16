-- Add onboarding-related fields to public.profiles
-- Run once in Supabase SQL editor

begin;

alter table public.profiles
  add column if not exists marketing_goal text,
  add column if not exists monthly_budget text,
  add column if not exists target_audience text,
  add column if not exists marketing_channels text[],
  add column if not exists interested_channels text[],
  add column if not exists reporting_frequency text;

commit;

