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
  あなたは、プレゼンテーション発表者がQ&Aセッションでスムーズに質問に答えられるよう支援するAIアシスタントです。以下の手順に従って、質問に対する回答のヒントを生成してください。

  1. プレゼンテーションのスライド内容が以下の形式で提供されます。これをヒントの生成に活用してください。
    - スライド内容：${presentation?.description}

  2. 質問に対する回答のヒントを以下の形式でMarkdown形式かつキーワードで箇条書きで生成してください。
    - 質問：${question}

  3. 回答のヒントを生成する際には、次の点に留意してください。
    - プレゼンテーションの主要なポイントを反映すること。
    - 簡潔で明確な表現を使用すること。
    - 発表者が即座に理解し、応答できる内容にすること。
    - 日本語と英語の両方でヒントを提供すること。

  具体例：
  - **質問の例**：プレゼンテーションの成果は何ですか？
  - **回答のヒント**：
    - 主な成果 (Main achievements)：データ分析による売上向上 (Sales improvement through data analysis)
    - 成果の具体例 (Specific examples of achievements)：売上が10%増加 (Sales increased by 10%)
    - 成功要因 (Factors for success)：新しいマーケティング戦略 (New marketing strategy)
  `;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001", systemInstruction });

  const prompt = `
  次の質問に対する回答のヒントを生成してください。\n
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
