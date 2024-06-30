"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { parseISO } from "date-fns";
import { Tables } from "@/types/supabase";

const presentationSchema = z.object({
  speakerId: z.number(),
  formData: z.instanceof(FormData).refine((data) => {
    return data.has("title") && data.has("description") &&
      data.has("startTime") && data.has("endTime");
  }, {
    message:
      "FormData must contain 'title', 'description', 'startTime', and 'endTime' fields",
  }).refine((data) => {
    const endTime = data.get("endTime");
    return endTime === null || endTime === "" || typeof endTime === "string";
  }, {
    message: "endTime must be a string or null",
  }),
});

export async function createPresentation(
  speakerId: number,
  formData: FormData,
) {
  try {
    // Validate the input using the presentationSchema
    const validationResult = presentationSchema.safeParse({
      speakerId,
      formData,
    });

    if (!validationResult.success) {
      throw new Error(
        validationResult.error.errors.map((e) => e.message).join(", "),
      );
    }

    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      throw new Error("You must be logged in to create a presentation");
    }

    const startTime = parseISO(formData.get("startTime") as string);
    const endTime = formData.get("endTime")
      ? parseISO(formData.get("endTime") as string)
      : null;
    const { data, error } = await supabase
      .from("presentations")
      .insert({
        speaker_id: speakerId,
        title: formData.get("title"),
        description: formData.get("description"),
        start_time: startTime,
        end_time: endTime,
      })
      .select()
      .returns<Tables<"presentations">>();

    if (error) {
      throw error;
    }
    console.log("Created presentation:", data);
  } catch (error) {
    console.error("Error creating presentation:", error);
    throw error;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
