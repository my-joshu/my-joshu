import { PresentationDashboard } from "@/components/PresentationDashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Tables } from "@/types/supabase";

export default async function PresentationsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    return redirect("/login");
  }

  const { data: speaker } = await supabase
    .from("speakers")
    .select("*")
    .eq("uuid", user.id)
    .single<Tables<"speakers">>();

  if (!speaker) {
    throw new Error("Speaker not found");
  }

  const { data: presentations, error } = await supabase
    .from("presentations")
    .select("*")
    .eq("speaker_id", speaker.id)
    .returns<Tables<"presentations">[]>();

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch presentations");
  }

  return (
    <PresentationDashboard
      presentations={presentations}
      speakerId={speaker.id}
    />
  );
}
