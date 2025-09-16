-- Update signup trigger to create profile AND account_members entry
-- This ensures new users have both profile and account_members records

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
  default_account_id text;
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

  -- Create a default account first, then account_members entry
  -- Generate a proper UUID for the account
  default_account_id := gen_random_uuid()::text;

  -- First create the account
  insert into public.accounts (id, owner, company_name, created_at)
  values (
    default_account_id,
    new.id,
    coalesce(new.raw_user_meta_data ->> 'company', full_name_val || '''s Company'),
    now()
  );

  -- Then create the account_members entry
  insert into public.account_members (user_id, account_id, role, created_at)
  values (
    new.id,
    default_account_id,
    'admin',
    now()
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

-- The trigger is already created, so we just need to update the function
-- If you need to recreate the trigger:
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to authenticated, anon;
grant all on public.profiles to authenticated;
grant all on public.account_members to authenticated;
grant select on public.profiles to anon;