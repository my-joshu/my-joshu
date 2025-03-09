import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { z } from "zod";
import { aiService } from "@/services/ai";
import { logger } from "@/services/logger";
import { withErrorHandling, createApiError } from "../middleware";

// Schema for GET request query parameters
const GetQuerySchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

// Schema for POST request body
const PostBodySchema = z.object({
  question: z.string().min(1, "Question is required"),
  presentationId: z.coerce.string().min(1, "Presentation ID is required"),
  questionId: z.coerce.number().int().positive("Question ID must be a positive integer"),
});

export const GET = withErrorHandling(async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    createApiError("unauthorized", "You must be logged in!", 401);
  }

  const searchParams = request.nextUrl.searchParams;

  // Validate query parameters
  const queryResult = GetQuerySchema.safeParse({
    questionId: searchParams.get("questionId"),
  });

  if (!queryResult.success) {
    createApiError("validation_error", queryResult.error.message, 400, queryResult.error.format());
  }

  const { questionId } = queryResult.data;

  const { data } = await supabase
    .from("question_answer_hints")
    .select("*")
    .eq("question_id", Number(questionId))
    .order("created_at", { ascending: false })
    .limit(1)
    .single<Tables<"question_answer_hints">>();

  return NextResponse.json({ ok: true, answer: data?.content || "" });
});

export const POST = withErrorHandling(async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    createApiError("unauthorized", "You must be logged in!", 401);
  }

  // Validate request body
  const requestBody = await request.json().catch(() => ({}));
  const bodyResult = PostBodySchema.safeParse(requestBody);

  if (!bodyResult.success) {
    createApiError("validation_error", "Invalid request data", 400, bodyResult.error.format());
  }

  const { question, presentationId, questionId } = bodyResult.data;

  logger.info({ questionId, presentationId }, "Processing answer hint generation");

  const { data: presentation } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", presentationId)
    .single<Tables<"presentations">>();

  // Get hint using AI service
  const presentationContent = presentation?.description || '';

  const hintResult = await aiService.generateHint({
    presentationContent,
    question,
    maxTokens: 1024,
    temperature: 0.7,
  });

  if (hintResult.error) {
    logger.error({ error: hintResult.error, questionId }, "Failed to generate answer hint");
    createApiError("ai_generation_error", "Failed to generate answer hint", 500, hintResult.error);
  }

  const answer = hintResult.hint;

  const { data } = await supabase
    .from("question_answer_hints")
    .insert({ question_id: questionId, content: answer })
    .select("*")
    .single<Tables<"question_answer_hints">>();

  if (!data) {
    logger.error({ questionId }, "Failed to create question_answer_hints record");
    createApiError("database_error", "Failed to save answer hint", 500);
  }

  logger.info({ questionId }, "Successfully generated and saved answer hint");
  return NextResponse.json({ ok: true, answer });
});
