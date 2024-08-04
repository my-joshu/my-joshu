import { createClient } from '@/utils/supabase/client';
import { beforeAll, afterAll } from 'vitest';
import { Tables } from '@/types/supabase';

const supabase = createClient();

let testData: {
  speakerId: string | undefined;
  attendeeId: string | undefined;
  presentationId: string | undefined;
  questionId: string | undefined;
};

beforeAll(async () => {
  // Insert a speaker
  const { data: speakerData } = await supabase
    .from('speakers')
    .insert({ name: 'Test Speaker', email: 'test.speaker@example.com' })
    .select('uuid')
    .single<Tables<'speakers'>>();
  const speakerId = speakerData?.uuid;

  // Insert an attendee
  const { data: attendeeData } = await supabase
    .from('attendees')
    .insert({ name: 'Test Attendee' })
    .select('uuid')
    .single<Tables<'attendees'>>();
  const attendeeId = attendeeData?.uuid;

  // Insert a presentation
  const { data: presentationData } = await supabase
    .from('presentations')
    .insert({ title: 'Test Presentation', description: 'Test Description', speaker_id: speakerId })
    .select('uuid')
    .single<Tables<'presentations'>>();
  const presentationId = presentationData?.uuid;

  // Insert a question
  const { data: questionData } = await supabase
    .from('questions')
    .insert({ presentation_id: presentationId, attendee_id: attendeeId, content: 'Test Question' })
    .select('uuid')
    .single<Tables<'questions'>>();
  const questionId = questionData?.uuid;

  // 保存したIDを変数に設定
  testData = { speakerId, attendeeId, presentationId, questionId };
});

afterAll(async () => {
  const { speakerId, attendeeId, presentationId, questionId } = testData;

  await supabase.from('questions').delete().eq('uuid', questionId);
  await supabase.from('presentations').delete().eq('uuid', presentationId);
  await supabase.from('attendees').delete().eq('uuid', attendeeId);
  await supabase.from('speakers').delete().eq('uuid', speakerId);
});

export { supabase };
