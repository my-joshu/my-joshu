import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    throw new Error("You must be logged in!");
  }

  const searchParams = request.nextUrl.searchParams;
  const questionId = searchParams.get("questionId");

  if (!questionId) {
    throw new Error("questionId is required");
  }

  const { data } = await supabase
    .from("question_answer_hints")
    .select("*")
    .eq("question_id", Number(questionId))
    .order("created_at", { ascending: false })
    .limit(1)
    .single<Tables<"question_answer_hints">>();

  return NextResponse.json({ ok: true, answer: data?.content || "" });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    throw new Error("You must be logged in!");
  }

  const { question, presentationId, questionId } = await request.json();

  const { data: presentation } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", presentationId)
    .single<Tables<"presentations">>();

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
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001",
    systemInstruction,
  });

  const prompt = `
  Generate helpful hints for answering the questions in the following question, using Markdown and bullet points.\n
  ${question}
  `;

  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  const { data } = await supabase
    .from("question_answer_hints")
    .insert({ question_id: questionId, content: answer })
    .select("*")
    .single<Tables<"question_answer_hints">>();

  if (!data) {
    console.error(
      `Failed to create question_answer_hints questionId: ${questionId}`
    );
  }

  return NextResponse.json({ ok: true, answer: answer });
}
