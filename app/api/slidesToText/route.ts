import { extractText } from "@/utils/slidesToText";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request): Promise<Response> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.is_anonymous) {
      throw new Error("You must be logged in to create a presentation");
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!(files && files.length > 0) || !(files[1] instanceof File)) {
      throw new Error("Please upload file");
    }

    const text = await extractText(files[1]);

    // TODO: Format text using LLM API if needed

    return new Response(JSON.stringify({ status: "ok", text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let message = "Error during text extraction.";
    if (error instanceof Error) {
      message += " " + error.message;
    }

    return new Response(JSON.stringify({ status: "error", message: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
