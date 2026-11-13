-- OBSIDEX: schéma initial. À exécuter dans Supabase > SQL Editor.
create table if not exists public.people (
  id text primary key,
  rank integer,
  type text not null check (type in ('Élève','Professeur')),
  name text not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.people enable row level security;
alter table public.admin_users enable row level security;
create or replace function public.is_obsidex_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = auth.uid()); $$;
drop policy if exists "Public can read people" on public.people;
create policy "Public can read people" on public.people for select using (true);
drop policy if exists "Only admin can insert people" on public.people;
create policy "Only admin can insert people" on public.people for insert with check (public.is_obsidex_admin());
drop policy if exists "Only admin can update people" on public.people;
create policy "Only admin can update people" on public.people for update using (public.is_obsidex_admin()) with check (public.is_obsidex_admin());
drop policy if exists "Only admin can delete people" on public.people;
create policy "Only admin can delete people" on public.people for delete using (public.is_obsidex_admin());
drop policy if exists "Admin can read own admin record" on public.admin_users;
create policy "Admin can read own admin record" on public.admin_users for select using (user_id = auth.uid());
-- Storage public pour lecture des illustrations, écriture réservée à l'admin.
insert into storage.buckets (id, name, public) values ('obsidex-images','obsidex-images',true) on conflict (id) do nothing;
drop policy if exists "Public can view OBSIDEX images" on storage.objects;
create policy "Public can view OBSIDEX images" on storage.objects for select using (bucket_id = 'obsidex-images');
drop policy if exists "Admin can upload OBSIDEX images" on storage.objects;
create policy "Admin can upload OBSIDEX images" on storage.objects for insert with check (bucket_id = 'obsidex-images' and public.is_obsidex_admin());
drop policy if exists "Admin can update OBSIDEX images" on storage.objects;
create policy "Admin can update OBSIDEX images" on storage.objects for update using (bucket_id = 'obsidex-images' and public.is_obsidex_admin()) with check (bucket_id = 'obsidex-images' and public.is_obsidex_admin());
drop policy if exists "Admin can delete OBSIDEX images" on storage.objects;
create policy "Admin can delete OBSIDEX images" on storage.objects for delete using (bucket_id = 'obsidex-images' and public.is_obsidex_admin());

-- État du Power Ranking : un seul document JSON partagé entre tous les visiteurs.
create table if not exists public.ranking_state (
  id text primary key check (id = 'main'),
  state jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.ranking_state enable row level security;
drop policy if exists "Public can read ranking" on public.ranking_state;
create policy "Public can read ranking" on public.ranking_state for select using (true);
drop policy if exists "Admin can insert ranking" on public.ranking_state;
create policy "Admin can insert ranking" on public.ranking_state for insert with check (public.is_obsidex_admin());
drop policy if exists "Admin can update ranking" on public.ranking_state;
create policy "Admin can update ranking" on public.ranking_state for update using (public.is_obsidex_admin()) with check (public.is_obsidex_admin());
