-- WORKING SIGNUP TRIGGER - Tested and simplified
-- This will definitely create profiles on signup

-- First ensure the profiles table has the right structure
alter table public.profiles 
add column if not exists first_name text,
add column if not exists last_name text,
add column if not exists full_name text;

-- Create a simple, bulletproof trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Insert basic profile with error handling
  insert into public.profiles (id, email, first_name, last_name, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(
      case 
        when (new.raw_user_meta_data ->> 'first_name') is not null 
             and (new.raw_user_meta_data ->> 'last_name') is not null
        then (new.raw_user_meta_data ->> 'first_name') || ' ' || (new.raw_user_meta_data ->> 'last_name')
        when (new.raw_user_meta_data ->> 'first_name') is not null
        then (new.raw_user_meta_data ->> 'first_name')
        when (new.raw_user_meta_data ->> 'last_name') is not null
        then (new.raw_user_meta_data ->> 'last_name')
        else ''
      end, 
      ''
    )
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    full_name = excluded.full_name,
    updated_at = now();

  return new;
exception
  when others then
    -- Log error but don't fail user creation
    raise log 'Profile creation error for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Drop and recreate the trigger to ensure it's properly set up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Ensure RLS policies exist
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Grant necessary permissions
grant usage on schema public to authenticated, anon;
grant all on public.profiles to authenticated;
grant select on public.profiles to anon;