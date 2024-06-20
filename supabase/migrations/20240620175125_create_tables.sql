
CREATE TABLE speakers (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendees (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    name TEXT DEFAULT LEFT(md5(random()::text), 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE presentations (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMPTZ,
    speaker_id INTEGER NOT NULL,
    qr_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id)
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    presentation_id INTEGER NOT NULL,
    attendee_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (presentation_id) REFERENCES presentations(id),
    FOREIGN KEY (attendee_id) REFERENCES attendees(id)
);

CREATE TABLE question_answer_hints (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    question_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Indexes
CREATE INDEX idx_speakers_email ON speakers(email);
CREATE INDEX idx_presentation_speaker_id_start_time ON presentations(speaker_id, start_time);
CREATE INDEX idx_presentations_speaker_id ON presentations(speaker_id);
CREATE INDEX idx_questions_presentation_id_attendee_id ON questions(presentation_id, attendee_id);
CREATE INDEX idx_question_answer_hints_question_id ON question_answer_hints(question_id);
