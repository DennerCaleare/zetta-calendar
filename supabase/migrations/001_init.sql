-- =============================================================
-- Zetta Calendar — Supabase Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- ── 1. Profiles (extends auth.users) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name    TEXT NOT NULL,
  email   TEXT NOT NULL,
  role    TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    'USER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. Rooms ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rooms (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  capacity   INTEGER NOT NULL DEFAULT 6,
  resources  TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Reservations ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reservations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED')),
  room_id     UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for conflict checks
CREATE INDEX IF NOT EXISTS idx_reservations_room_time
  ON public.reservations(room_id, start_time, end_time)
  WHERE status = 'ACTIVE';

-- ── 4. Row Level Security ──────────────────────────────────────
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- profiles: authenticated users can read all; only owner can update own profile; admins can update any
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- rooms: all authenticated users can read; only admins can write
CREATE POLICY "rooms_select" ON public.rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rooms_insert_admin" ON public.rooms
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "rooms_update_admin" ON public.rooms
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "rooms_delete_admin" ON public.rooms
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- reservations: all authenticated can read; owner or admin can insert/update/delete
CREATE POLICY "reservations_select" ON public.reservations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "reservations_insert" ON public.reservations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reservations_update" ON public.reservations
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "reservations_delete" ON public.reservations
  FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- ── 5. Seed: initial admin user ────────────────────────────────
-- Create the admin user via Supabase Auth dashboard or the app's register flow.
-- Then run this to promote them to ADMIN (replace the email below):
--
-- UPDATE public.profiles SET role = 'ADMIN' WHERE email = 'admin@zetta.com.br';
