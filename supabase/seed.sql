INSERT INTO speakers (uuid, name, email) VALUES
    (uuid_generate_v4(), 'John Doe', 'john.doe@example.com'),
    (uuid_generate_v4(), 'Jane Smith', 'jane.smith@example.com');

INSERT INTO attendees (uuid, name) VALUES
    (uuid_generate_v4(), LEFT(md5(random()::text), 8)),
    (uuid_generate_v4(), LEFT(md5(random()::text), 8));

INSERT INTO presentations (uuid, title, description, speaker_id) VALUES
    (uuid_generate_v4(), 'Presentation 1', 'Description for Presentation 1', 1),
    (uuid_generate_v4(), 'Presentation 2', 'Description for Presentation 2', 2);

INSERT INTO questions (uuid, presentation_id, attendee_id, content) VALUES
    (uuid_generate_v4(), 1, 1, 'Question 1 for Presentation 1'),
    (uuid_generate_v4(), 1, 2, 'Question 2 for Presentation 1'),
    (uuid_generate_v4(), 2, 1, 'Question 1 for Presentation 2'),
    (uuid_generate_v4(), 2, 2, 'Question 2 for Presentation 2');

INSERT INTO question_answer_hints (uuid, question_id, content) VALUES
    (uuid_generate_v4(), 1, 'Hint 1 for Question 1'),
    (uuid_generate_v4(), 2, 'Hint 1 for Question 2'),
    (uuid_generate_v4(), 3, 'Hint 1 for Question 3'),
    (uuid_generate_v4(), 4, 'Hint 1 for Question 4');
