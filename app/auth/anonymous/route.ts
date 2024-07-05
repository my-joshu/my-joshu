import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// URL for QR code: http://localhost:3000/auth/anonymous?presentationId=1
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const presentationId = requestUrl.searchParams.get("presentationId");
  const origin = requestUrl.origin;

  const supabase = createClient();
  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Authentication failed", error);
    return NextResponse.redirect(`${origin}/`);
  }

  return NextResponse.redirect(`${origin}/live/${presentationId}/questions`);
}
