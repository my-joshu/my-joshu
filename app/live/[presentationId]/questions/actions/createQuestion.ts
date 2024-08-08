"use server";

import { z } from "zod";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

const QuestionSchema = z.object({
  presentationId: z.number(),
  attendeeId: z.number(),
  content: z
    .string()
    .trim()
    .min(1, "Please enter your question.")
    .max(160, "Too many characters, maximum is 160."),
});

async function validateInput(
  presentationId: number,
  attendeeId: number,
  formData: FormData
) {
  const validationResult = QuestionSchema.safeParse({
    presentationId,
    attendeeId,
    content: formData.get("content"),
  });

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    console.error(errors);
    throw new Error(
      errors.content ? errors.content[0] : "Missing field to create question."
    );
  }

  return validationResult.data;
}

// Note: Supabase Realtime updates the new question within useEffect on the client side
export async function createQuestion(
  presentationId: number,
  attendeeId: number,
  prevState: {
    resetKey: string;
    message: string;
  },
  formData: FormData
) {
  const supabase = createClient();

  try {
    const { content } = await validateInput(
      presentationId,
      attendeeId,
      formData
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.is_anonymous) {
      throw new Error("User not authorized, please rejoin.");
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({
        presentation_id: presentationId,
        attendee_id: attendeeId,
        content,
      })
      .select()
      .single<Tables<"questions">>();

    if (error) {
      throw new Error("Poor internet communication.");
    }

    return {
      resetKey: data.uuid,
      message: "",
    };
  } catch (error) {
    let message = "Failed to create question.";
    if (error instanceof Error) {
      message = `${error.message}`;
    }

    return {
      resetKey: prevState.resetKey,
      message: message,
    };
  }
}
