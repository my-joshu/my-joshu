-- Add created_at and updated_at columns to the question_answer_hints table
ALTER TABLE question_answer_hints
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add a unique constraint to the email column in the speakers table
ALTER TABLE speakers
ADD CONSTRAINT speakers_email_constraint UNIQUE (email);