-- Add marketing_challenges to profiles
begin;
alter table public.profiles
  add column if not exists marketing_challenges text;
commit;

