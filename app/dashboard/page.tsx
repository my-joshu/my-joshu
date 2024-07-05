import AuthButton from "@/components/AuthButton";
import { PresentationDashboard } from "@/components/PresentationDashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Tables } from "@/types/supabase";

export default async function DashboardPage() {
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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <p className="font-bold text-lg">MyJoshu</p>
            <AuthButton />
          </div>
        </nav>
        <PresentationDashboard
          presentations={presentations}
          speakerId={speaker.id}
        />
      </div>
    </div>
  );
}
