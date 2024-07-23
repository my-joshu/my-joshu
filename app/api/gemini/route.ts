import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    throw new Error("You must be logged in!");
  }

  const { question } = await request.json();
  const start: Date = new Date();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  次の質問に対する回答のヒントをMarkdown形式かつキーワードで箇条書きで下さい。\n
  ${question}
  `;

  const result = await model.generateContent(prompt);

  console.log("text", result.response.text());
  console.log("candidates", result.response.candidates);

  const finish: Date = new Date();
  console.log(
    "start: ",
    start,
    ", finish: ",
    finish,
    ", diff: ",
    `${finish.getTime() - start.getTime()} ms`
  );

  return NextResponse.json({ ok: true, answer: result.response.text() });
}
