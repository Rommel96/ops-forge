--! Previous: -
--! Hash: sha1:db237bb498e4d541b88eda5d1646c96cd17701b2
--! Message: create-schemas-and-roles

-- Migration: Create schemas, roles, and custom types
-- Description: Foundation layer for Ops-Forge database

-- Schemas
CREATE SCHEMA IF NOT EXISTS app_public;
CREATE SCHEMA IF NOT EXISTS app_private;

-- Custom ENUM types
CREATE TYPE app_public.task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE app_public.task_priority AS ENUM ('low', 'medium', 'high');

-- Utility function: auto-update updated_at
CREATE OR REPLACE FUNCTION app_public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
