-- ============================================================================
-- Base de données des comptes du site TSSR (Supabase)
-- À coller une seule fois dans Supabase → SQL Editor → New query → Run.
--
-- Une ligne = une donnée de révision d'un utilisateur (suivi des TP,
-- profils du QCM, planning…). Chaque utilisateur ne voit et ne modifie
-- QUE ses propres lignes, grâce aux règles RLS (Row Level Security).
-- ============================================================================

create table if not exists public.user_data (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  key        text        not null check (key like 'tssr-%' and length(key) <= 64),
  value      text,
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  constraint user_data_taille check (value is null or length(value) <= 2000000)
);

alter table public.user_data enable row level security;

drop policy if exists "lire ses donnees"      on public.user_data;
drop policy if exists "ajouter ses donnees"   on public.user_data;
drop policy if exists "modifier ses donnees"  on public.user_data;
drop policy if exists "supprimer ses donnees" on public.user_data;

create policy "lire ses donnees" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "ajouter ses donnees" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "modifier ses donnees" on public.user_data
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "supprimer ses donnees" on public.user_data
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Aucun accès pour les visiteurs non connectés
revoke all on public.user_data from anon;
grant select, insert, update, delete on public.user_data to authenticated;
