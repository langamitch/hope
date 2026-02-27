create extension if not exists pgcrypto;

create table if not exists public.wishlist_inquiries (
  id uuid primary key default gen_random_uuid(),
  item_id text not null,
  model text not null,
  storage text not null,
  price text not null,
  message text not null,
  whatsapp_url text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists wishlist_inquiries_expires_at_idx
  on public.wishlist_inquiries (expires_at);

alter table public.wishlist_inquiries enable row level security;

drop policy if exists "deny direct client access" on public.wishlist_inquiries;
create policy "deny direct client access"
on public.wishlist_inquiries
for all
using (false)
with check (false);

create or replace function public.cleanup_expired_wishlist_inquiries()
returns void
language sql
security definer
as $$
  delete from public.wishlist_inquiries
  where expires_at <= now();
$$;
