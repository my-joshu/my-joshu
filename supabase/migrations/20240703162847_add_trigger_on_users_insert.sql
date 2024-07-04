-- This migration creates a function and trigger to add a new speaker or attendee based on whether they are anonymous or not after an auth user created

CREATE OR REPLACE FUNCTION add_user_to_speaker_or_attendee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.is_anonymous THEN
    INSERT INTO public.attendees(uuid, name)
    VALUES (NEW.id, SUBSTRING(md5(random()::text) FROM 1 FOR 8));
  ELSE
    INSERT INTO public.speakers(uuid, name, email)
    VALUES (NEW.id, NEW.email, NEW.email);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trigger_add_user_to_speaker_or_attendee
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE add_user_to_speaker_or_attendee();
