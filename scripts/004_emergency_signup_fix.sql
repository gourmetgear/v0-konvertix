-- EMERGENCY FIX: Restore basic signup functionality
-- Run this IMMEDIATELY to fix broken user creation

-- Create a minimal, safe trigger that only creates profiles
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
  -- Extract names from metadata with safe null handling
  first_name_val := coalesce(new.raw_user_meta_data ->> 'first_name', '');
  last_name_val := coalesce(new.raw_user_meta_data ->> 'last_name', '');
  
  -- Create full_name
  if first_name_val != '' and last_name_val != '' then
    full_name_val := first_name_val || ' ' || last_name_val;
  elsif first_name_val != '' then
    full_name_val := first_name_val;
  elsif last_name_val != '' then
    full_name_val := last_name_val;
  else
    full_name_val := '';
  end if;

  -- ONLY insert profile - remove account_members for now to fix signup
  insert into public.profiles (id, email, first_name, last_name, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    first_name_val,
    last_name_val,
    full_name_val
  );
  
  return new;
exception
  when others then
    -- Log error but don't fail user creation
    raise log 'Error in handle_new_user: %', sqlerrm;
    return new;
end;
$$;

-- Ensure the trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions
grant usage on schema public to authenticated, anon;
grant all on public.profiles to authenticated;
grant select on public.profiles to anon;