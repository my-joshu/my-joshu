import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    throw new Error("You must be logged in!");
  }

  const { question, presentationId } = await request.json();
  const { data: presentation } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", presentationId)
    .single<Tables<"presentations">>();
  const start: Date = new Date();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const systemInstruction = `
  You are an AI assistant designed to help presentation speakers smoothly answer questions during Q&A sessions. Follow the instructions below to generate helpful hints for answering questions.

  1. The presentation slide content will be provided as follows. Use this content to generate your hints.
    - Slide content: ${presentation?.description}

  2. Generate helpful hints for answering the questions in the following format, using Markdown and bullet points.
    - Question: ${question}

  3. When generating hints, keep the following points in mind:
    - Reflect the main points of the presentation.
    - Use concise and clear expressions.
    - Make sure the hints are easy for the speaker to understand and respond to immediately.

  Example:
  ## Hints:
    ### Main features: High-speed data processing engine
    - xxx
    - xxx
    - xxx
    ### Specific examples of features: Real-time data analytics
    - xxx
    - xxx
    - xxx
    ### Advantages: Scalable architecture
    - xxx
    - xxx
    - xxx
  `;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001", systemInstruction });

  const prompt = `
  Generate helpful hints for answering the questions in the following question, using Markdown and bullet points.\n
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
