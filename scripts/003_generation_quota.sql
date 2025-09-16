-- Tracks per-user monthly image generation usage
-- Run this in your Supabase SQL editor once.

begin;

create table if not exists public.generation_usage (
  user_id uuid not null,
  month_start date not null,
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, month_start)
);

create index if not exists generation_usage_user_month_idx on public.generation_usage(user_id, month_start);

-- Atomically increment usage; returns the new count after increment.
-- If the increment would exceed 100, it raises an exception.
create or replace function public.increment_generation_usage(
  p_user uuid,
  p_month date,
  p_inc int
) returns int
language plpgsql
as $$
declare
  v_count int;
begin
  if p_inc = 0 then
    select count into v_count from public.generation_usage where user_id = p_user and month_start = p_month;
    return coalesce(v_count, 0);
  end if;

  insert into public.generation_usage as gu(user_id, month_start, count)
  values (p_user, p_month, 0)
  on conflict (user_id, month_start)
  do nothing;

  -- Lock the row to prevent races
  select count into v_count from public.generation_usage where user_id = p_user and month_start = p_month for update;
  v_count := coalesce(v_count, 0);

  if p_inc > 0 and v_count + p_inc > 100 then
    raise exception 'quota exceeded';
  end if;

  update public.generation_usage
  set count = greatest(0, count + p_inc), updated_at = now()
  where user_id = p_user and month_start = p_month;

  select count into v_count from public.generation_usage where user_id = p_user and month_start = p_month;
  return v_count;
end;
$$;

commit;

