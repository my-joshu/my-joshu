-- Enable RLS
ALTER TABLE "speakers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "attendees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "presentations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "question_answer_hints" ENABLE ROW LEVEL SECURITY;

-- Policies
-- Speakers
CREATE POLICY "Speakers are only visible to themselves"
ON speakers FOR SELECT
USING ( (SELECT auth.uid()) = uuid );

CREATE POLICY "Speakers can run any operations on their presentations"
ON presentations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM speakers
    WHERE presentations.speaker_id = speakers.id
    AND speakers.uuid = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM speakers
    WHERE presentations.speaker_id = speakers.id
    AND speakers.uuid = (SELECT auth.uid())
  )
);

CREATE POLICY "Speaker can see questions"
ON questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = questions.presentation_id
    AND EXISTS (
      SELECT 1 FROM speakers
      WHERE presentations.speaker_id = speakers.id
      AND speakers.uuid = (SELECT auth.uid())
    )
  )
);

-- Attendees
CREATE POLICY "Attendees are only visible to everyone"
ON attendees
AS PERMISSIVE
FOR SELECT
TO public
USING ( true );

CREATE POLICY "Attendees can access presentations to join Q&A session"
ON presentations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM attendees
    WHERE attendees.uuid = (SELECT auth.uid())
  )
);

-- Questions
CREATE POLICY "Questions can be seen by anonymous users"
ON questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM attendees
    WHERE attendees.uuid = (SELECT auth.uid())
  )
);

CREATE POLICY "Questions can be answered by attendees"
ON questions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM attendees
    WHERE questions.attendee_id = attendees.id
    AND attendees.uuid = (SELECT auth.uid())
  )
);
