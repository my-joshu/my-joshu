// import { supabase } from './setup';
import { describe, it, expect } from 'vitest';
// import { Tables } from '@/types/supabase';

// TODO: Remove later
describe('Dummy Test Suite', () => {
  it('should pass a dummy test', () => {
    expect(true).toBe(true);
  });

  it('should fail a dummy test', () => {
    expect(false).toBe(false);
  });
});


// describe('Row Level Security Policies', () => {
//   let speakerId: string | undefined;
//   let attendeeId: string | undefined;
//   let presentationId: string | undefined;
//   let questionId: string | undefined;

//   it('should allow speaker to see their own data', async () => {
//     const { data, error } = await supabase
//       .from('speakers')
//       .select('*')
//       .eq('uuid', speakerId)
//       .single<Tables<'speakers'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data!.uuid).toBe(speakerId);
//   });

//   it('should allow attendees to see all attendees', async () => {
//     const { data, error } = await supabase
//       .from('attendees')
//       .select('*')
//       .single<Tables<'attendees'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data).toHaveLength(1);
//   });

//   it('should allow speaker to see their presentations', async () => {
//     const { data, error } = await supabase
//       .from('presentations')
//       .select('*')
//       .eq('speaker_id', speakerId)
//       .single<Tables<'presentations'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data!.length).toBeGreaterThan(0);
//   });

//   it('should allow attendees to see presentations', async () => {
//     const { data, error } = await supabase
//       .from('presentations')
//       .select('*')
//       .single<Tables<'presentations'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data!.length).toBeGreaterThan(0);
//   });

//   it('should allow speaker to see questions for their presentations', async () => {
//     const { data, error } = await supabase
//       .from('questions')
//       .select('*')
//       .eq('presentation_id', presentationId)
//       .single<Tables<'questions'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data!.length).toBeGreaterThan(0);
//   });

//   it('should allow attendees to see questions', async () => {
//     const { data, error } = await supabase
//       .from('questions')
//       .select('*')
//       .single<Tables<'questions'>>();

//     expect(error).toBeNull();
//     expect(data).toBeTruthy();
//     expect(data!.length).toBeGreaterThan(0);
//   });
// });
