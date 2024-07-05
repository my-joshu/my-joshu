import { QASession } from "@/components/QASession";
import { createQuestion } from "./actions/createQuestion";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export default async function LiveQuestions({
  params,
}: {
  params: { presentationId: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.is_anonymous) {
    throw new Error("Anonymous user not found");
  }

  const { data: attendee } = await supabase
    .from("attendees")
    .select("*")
    .eq("uuid", user.id)
    .single<Tables<"attendees">>();

  if (!attendee) {
    throw new Error("Attendee not found");
  }

  const { data: presentation } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", params.presentationId)
    .single<Tables<"presentations">>();

  if (!presentation) {
    throw new Error("Presentation not found");
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("presentation_id", presentation.id)
    .returns<Tables<"questions">[]>();

  const createQuestionBoundArgs = createQuestion.bind(
    null,
    Number(params.presentationId),
    attendee.id
  );

  return (
    <QASession
      serverQuestions={questions ?? []}
      createQuestionBoundArgs={createQuestionBoundArgs}
    />
  );
}
