import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

type QuestionUpdatePayload = {
  answered: boolean;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { questionId: string } }
): Promise<
  NextResponse<{
    ok: boolean;
  }>
> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.is_anonymous) {
      throw new Error("You must be logged in!");
    }

    const payload: QuestionUpdatePayload = await request.json();

    // Update the answered field and return it
    const { data: question } = await supabase
      .from("questions")
      .update({ answered: !!payload.answered })
      .eq("id", Number(params.questionId))
      .select("*")
      .single<Tables<"questions">>();

    if (!question) {
      throw new Error("This question not found");
    }

    return NextResponse.json({ ok: true, message: "Successfully updated." });
  } catch (error: unknown) {
    console.error("PATCH questions API failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "An internal error occurred. Please try again later.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
