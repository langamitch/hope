create extension if not exists pgcrypto;

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'footer',
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_signups_email_unique_idx
  on public.newsletter_signups (lower(email));

create index if not exists newsletter_signups_created_at_idx
  on public.newsletter_signups (created_at desc);

alter table public.newsletter_signups enable row level security;

drop policy if exists "deny direct client access newsletter" on public.newsletter_signups;
create policy "deny direct client access newsletter"
on public.newsletter_signups
for all
using (false)
with check (false);
