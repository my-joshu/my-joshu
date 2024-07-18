import { extractText } from "@/utils/slidesToText";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request): Promise<Response> {
  // user authentication
  const formData = await req.formData();
  const files = formData.getAll("files");

  try {
    if (!(files && files.length > 0) || !(files[1] instanceof File)) {
      throw new Error("Please upload file");
    }

    const text = await extractText(files[1]);

    // TODO: Format text using LLM API

    return new Response(JSON.stringify({ status: "ok", text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    let message = "Error during text extraction";
    if (error instanceof Error) {
      message += " " + error.message;
    }

    return new Response(JSON.stringify({ status: "error", message: message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
