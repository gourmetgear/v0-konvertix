-- Create business_profiles table for onboarding data
-- This separates business data from basic user profiles

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_name text,
  website_url text,
  industry text,
  business_size text,
  marketing_goal text,
  monthly_budget text,
  target_audience text,
  marketing_challenges text,
  marketing_channels jsonb default '[]'::jsonb,
  interested_channels jsonb default '[]'::jsonb,
  reporting_frequency text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.business_profiles enable row level security;

-- Create RLS policies
create policy "Users can view own business profile" 
  on public.business_profiles for select 
  using (user_id = auth.uid());

create policy "Users can insert own business profile" 
  on public.business_profiles for insert 
  with check (user_id = auth.uid());

create policy "Users can update own business profile" 
  on public.business_profiles for update 
  using (user_id = auth.uid());

create policy "Users can delete own business profile" 
  on public.business_profiles for delete 
  using (user_id = auth.uid());

-- Create indexes
create index if not exists business_profiles_user_id_idx on public.business_profiles(user_id);

-- Create unique constraint - one business profile per user
create unique index if not exists business_profiles_user_unique 
  on public.business_profiles(user_id);

-- Grant permissions
grant usage on schema public to authenticated, anon;
grant all on public.business_profiles to authenticated;
grant select on public.business_profiles to anon;