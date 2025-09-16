-- Fix authentication trigger and profile creation
-- This script addresses common signup issues

-- First, ensure the profiles table exists with proper structure
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Drop existing policies to recreate them properly
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can delete own profile" on public.profiles;

-- Create RLS policies for profiles
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can delete own profile" 
  on public.profiles for delete 
  using (auth.uid() = id);

-- Create updated function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  first_name_val text;
  last_name_val text;
  full_name_val text;
begin
  -- Extract names from metadata with proper null handling
  first_name_val := coalesce(new.raw_user_meta_data ->> 'first_name', '');
  last_name_val := coalesce(new.raw_user_meta_data ->> 'last_name', '');
  
  -- Create full_name from first and last name
  if first_name_val != '' and last_name_val != '' then
    full_name_val := first_name_val || ' ' || last_name_val;
  elsif first_name_val != '' then
    full_name_val := first_name_val;
  elsif last_name_val != '' then
    full_name_val := last_name_val;
  else
    full_name_val := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  end if;

  -- Insert profile record
  insert into public.profiles (id, email, first_name, last_name, full_name)
  values (
    new.id,
    new.email,
    first_name_val,
    last_name_val,
    full_name_val
  );
  
  return new;
exception
  when others then
    -- Log the error (this will appear in Supabase logs)
    raise log 'Error in handle_new_user trigger: %', sqlerrm;
    -- Don't fail the user creation, just log the error
    return new;
end;
$$;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to authenticated, anon;
grant all on public.profiles to authenticated;
grant select on public.profiles to anon;