--! Previous: sha1:db237bb498e4d541b88eda5d1646c96cd17701b2
--! Hash: sha1:98d6d123b850c0ef513fe561204dd880e2b85c2c
--! Message: create-tables-indexes

-- Migration: Create tables, indexes, and triggers
-- Description: Core data model for users and tasks

-- ============================================================
-- Users table (public profile data)
-- ============================================================
CREATE TABLE app_public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON app_public.users
  FOR EACH ROW
  EXECUTE FUNCTION app_public.set_updated_at();

-- ============================================================
-- User secrets table (private credentials)
-- ============================================================
CREATE TABLE app_private.user_secrets (
  user_id UUID PRIMARY KEY REFERENCES app_public.users(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL
);

-- ============================================================
-- Tasks table
-- ============================================================
CREATE TABLE app_public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status app_public.task_status NOT NULL DEFAULT 'pending',
  priority app_public.task_priority NOT NULL DEFAULT 'medium',
  due_date DATE,
  owner_id UUID NOT NULL REFERENCES app_public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON app_public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION app_public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_tasks_status ON app_public.tasks(status);
CREATE INDEX idx_tasks_owner_id ON app_public.tasks(owner_id);
CREATE INDEX idx_tasks_priority ON app_public.tasks(priority);
