import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import SpeakerQASession from "@/components/SpeakerQASession";

export default async function PresentationPage({
  params,
}: {
  params: { presentationId: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    throw new Error("This page is only for authenticated users");
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

  return (
    <SpeakerQASession
      questions={questions || []}
      qrCode={presentation.qr_code}
    />
  );
}
