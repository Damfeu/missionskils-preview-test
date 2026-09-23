-- MissionSkills MVP — schema à exécuter dans Supabase (SQL Editor > New query > Run)
-- Choix MVP : pas d'auth Supabase (pas de mot de passe / email de confirmation, pour ne pas
-- créer de friction pendant le test des 5 utilisateurs). L'app génère un UUID côté client
-- au moment de l'inscription et l'utilise comme identifiant de profil.
-- RLS volontairement permissive (lecture/écriture publique via la clé "anon") car les données
-- sont non sensibles (nom, email, progression pédagogique) et le pilote est limité dans le temps.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key,
  name text not null,
  email text not null,
  profile text not null,
  xp int not null default 0,
  badges text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists course_progress (
  id bigint generated always as identity primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  course_id text not null,
  completed_modules text[] not null default '{}',
  course_completed boolean not null default false,
  quiz_attempts int not null default 0,
  quiz_score int,
  quiz_passed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (profile_id, course_id)
);

create table if not exists mission_progress (
  id bigint generated always as identity primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  mission_id text not null,
  status text not null default 'active' check (status in ('active', 'submitted')),
  completed_tasks text[] not null default '{}',
  submission_text text,
  submission_file_url text,
  submission_file_name text,
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (profile_id, mission_id)
);

alter table profiles enable row level security;
alter table course_progress enable row level security;
alter table mission_progress enable row level security;

-- Politiques permissives (MVP) : select/insert/update publics, pas de delete.
-- (drop + create pour que ce script soit rejouable sans erreur)
drop policy if exists "profiles_select" on profiles;
drop policy if exists "profiles_insert" on profiles;
drop policy if exists "profiles_update" on profiles;
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_insert" on profiles for insert with check (true);
create policy "profiles_update" on profiles for update using (true);

drop policy if exists "course_progress_select" on course_progress;
drop policy if exists "course_progress_insert" on course_progress;
drop policy if exists "course_progress_update" on course_progress;
create policy "course_progress_select" on course_progress for select using (true);
create policy "course_progress_insert" on course_progress for insert with check (true);
create policy "course_progress_update" on course_progress for update using (true);

drop policy if exists "mission_progress_select" on mission_progress;
drop policy if exists "mission_progress_insert" on mission_progress;
drop policy if exists "mission_progress_update" on mission_progress;
create policy "mission_progress_select" on mission_progress for select using (true);
create policy "mission_progress_insert" on mission_progress for insert with check (true);
create policy "mission_progress_update" on mission_progress for update using (true);

-- Storage : bucket public pour les livrables déposés par les testeurs.
insert into storage.buckets (id, name, public)
values ('mission-files', 'mission-files', true)
on conflict (id) do nothing;

drop policy if exists "mission_files_public_read" on storage.objects;
drop policy if exists "mission_files_public_insert" on storage.objects;
create policy "mission_files_public_read" on storage.objects
  for select using (bucket_id = 'mission-files');

create policy "mission_files_public_insert" on storage.objects
  for insert with check (bucket_id = 'mission-files');

-- ─────────────────────────────────────────────────────────────────────────
-- Missions proposées par des entreprises, avec validation par l'équipe avant
-- publication dans le marché de missions. Soumission publique (formulaire
-- /poster-une-mission), revue dans /admin.
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists company_missions (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_type text not null default '',
  contact_name text not null default '',
  contact_email text not null,
  title text not null,
  description text not null,
  context text not null,
  objective text not null,
  tools text[] not null default '{}',
  skills text[] not null default '{}',
  location text not null default '',
  deadline text not null default '',
  category text not null default '',
  tasks jsonb not null default '[]',
  required_course_id text,
  xp int,
  resource_file_url text,
  resource_file_name text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table company_missions enable row level security;

drop policy if exists "company_missions_select" on company_missions;
drop policy if exists "company_missions_insert" on company_missions;
drop policy if exists "company_missions_update" on company_missions;

-- Lecture publique (le marché de missions doit pouvoir lire les missions "approved",
-- et la page /admin, protégée seulement par un code côté client, doit pouvoir lire
-- toutes les lignes pour la revue).
create policy "company_missions_select" on company_missions for select using (true);

-- Une entreprise ne peut soumettre qu'en statut "pending" (elle ne peut pas
-- s'auto-approuver en manipulant la requête depuis le client).
create policy "company_missions_insert" on company_missions
  for insert with check (status = 'pending');

-- Mise à jour publique (utilisée uniquement par /admin en pratique).
create policy "company_missions_update" on company_missions for update using (true);
