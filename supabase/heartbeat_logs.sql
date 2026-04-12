create extension if not exists pgcrypto;

create table if not exists public.heartbeat_logs (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'alive',
  created_at timestamptz not null default now()
);

create index if not exists heartbeat_logs_created_at_idx
  on public.heartbeat_logs (created_at desc);

alter table public.heartbeat_logs enable row level security;

drop policy if exists "deny direct client access heartbeat" on public.heartbeat_logs;
create policy "deny direct client access heartbeat"
on public.heartbeat_logs
for all
using (false)
with check (false);

create or replace function public.log_heartbeat_if_due(
  p_status text default 'alive',
  p_interval_seconds integer default 601200
)
returns table (
  logged boolean,
  created_at timestamptz,
  last_created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_last_created_at timestamptz;
  v_status text := coalesce(nullif(trim(p_status), ''), 'alive');
begin
  perform pg_advisory_xact_lock(hashtext('public.heartbeat_logs'));

  select heartbeat_logs.created_at
  into v_last_created_at
  from public.heartbeat_logs
  order by heartbeat_logs.created_at desc
  limit 1;

  if v_last_created_at is not null
    and v_last_created_at > v_now - make_interval(secs => p_interval_seconds) then
    return query
    select false, v_last_created_at, v_last_created_at;
    return;
  end if;

  insert into public.heartbeat_logs (status, created_at)
  values (v_status, v_now);

  return query
  select true, v_now, v_last_created_at;
end;
$$;

revoke all on function public.log_heartbeat_if_due(text, integer) from public;
grant execute on function public.log_heartbeat_if_due(text, integer) to service_role;
