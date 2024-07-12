-- This migration file enables real-time tracking of changes to the questions table.
-- See more: https://supabase.com/docs/guides/realtime

alter publication supabase_realtime add table questions;
