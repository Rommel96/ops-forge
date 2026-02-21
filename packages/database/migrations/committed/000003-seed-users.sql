--! Previous: sha1:98d6d123b850c0ef513fe561204dd880e2b85c2c
--! Hash: sha1:8a3d5fe67dd8ae847741492a59c234e8db460616
--! Message: seed-users

-- Migration: Seed test users
-- Description: 3 test users with bcrypt-hashed passwords using pgcrypto

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Users
-- ============================================================
INSERT INTO app_public.users (id, username, email) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'admin',      'admin@opsforge.dev'),
  ('a1000000-0000-0000-0000-000000000002', 'maria.dev',  'maria@opsforge.dev'),
  ('a1000000-0000-0000-0000-000000000003', 'carlos.ops', 'carlos@opsforge.dev');

-- ============================================================
-- User secrets (using pgcrypto to hash passwords dynamically)
-- Admin123!, Maria123!, Carlos123!
-- ============================================================
INSERT INTO app_private.user_secrets (user_id, password_hash) VALUES
  ('a1000000-0000-0000-0000-000000000001', crypt('Admin123!', gen_salt('bf', 12))),
  ('a1000000-0000-0000-0000-000000000002', crypt('Maria123!', gen_salt('bf', 12))),
  ('a1000000-0000-0000-0000-000000000003', crypt('Carlos123!', gen_salt('bf', 12)));
