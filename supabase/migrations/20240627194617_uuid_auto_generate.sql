-- This migration will set the uuid column to auto-generate for all tables in PostgreSQL

-- Ensure the pgcrypto extension is enabled for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- For speakers table
ALTER TABLE speakers ALTER COLUMN uuid SET DEFAULT gen_random_uuid();

-- For attendees table
ALTER TABLE attendees ALTER COLUMN uuid SET DEFAULT gen_random_uuid();

-- For presentations table
ALTER TABLE presentations ALTER COLUMN uuid SET DEFAULT gen_random_uuid();

-- For questions table
ALTER TABLE questions ALTER COLUMN uuid SET DEFAULT gen_random_uuid();

-- For question_answer_hints table
ALTER TABLE question_answer_hints ALTER COLUMN uuid SET DEFAULT gen_random_uuid();
