"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { createQuestionsInsertChannelName } from "@/utils/channelName";
import AnswerHint from "./AnswerHint";
import { QuestionCard } from "./QuestionCard";
import { AnsweredQuestionCard } from "./AnsweredQuestionCard";

export default function SpeakerQASession({
  presentationId,
  serverQuestions,
  qrCode,
}: {
  presentationId: string;
  serverQuestions: Tables<"questions">[];
  qrCode: string | null;
}) {
  const router = useRouter();
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [hint, setHint] = useState<string | null>(null);
  const [questions, setQuestions] = useState(serverQuestions);
  const [isPending, startTransition] = useTransition();

  async function askGemini(
    question: string,
    presentationId: number
  ): Promise<{ ok: boolean; answer: string }> {
    const response = await fetch(`/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, presentationId }),
    });
    const result = await response.json();
    console.log("result", result);

    return result;
  }

  const handleGenerateHint = async (questionId: number) => {
    setSelectedQuestionId(questionId);

    startTransition(async () => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return;

      const questionContent = question.content;
      const result = await askGemini(questionContent, question.presentation_id);
      setHint(result.answer);
    });
  };

  const handleAnswerStatusChange = async (
    questionId: number,
    isAnswered: boolean
  ): Promise<void> => {
    const response = await fetch(`/api/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answered: isAnswered }),
    });

    const result: {
      ok: boolean;
      message: string;
    } = await response.json();

    if (!result.ok) {
      return console.error(result.message);
    }

    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? { ...question, answered: isAnswered }
          : question
      )
    );
  };

  // Listen for new questions in real-time
  useEffect(() => {
    const supabase = createClient();

    const realtimeChannel = supabase
      .channel(createQuestionsInsertChannelName(presentationId))
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          schema: "public",
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
          table: "questions",
          filter: `presentation_id=eq.${presentationId}`,
        },
        (payload) => {
          const newQuestion = payload.new as Tables<"questions">;
          setQuestions((prevState) => [newQuestion, ...prevState]);
        }
      )
      .subscribe();

    // Cleanup function to remove the channel when the component unmounts
    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 w-full flex-col">
      <main className="container mx-auto grid grid-cols-6 gap-4 py-2 px-2 md:px-4">
        <div className="col-span-5">
          <Button
            className="left-4 top-4 bg-gray-800 hover:bg-gray-700 flex items-center group text-sm border-none"
            variant="outline"
            onClick={() => router.push("/presentations")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to Presentations
          </Button>
        </div>
        <div className="col-span-3 space-y-4">
          <div className="rounded-lg border border-gray-700 p-4 bg-gray-800">
            <h3 className="text-xl font-bold text-teal-400">Answer Hints</h3>
            <div className="mt-2 space-y-2">
              {selectedQuestionId !== null &&
                (isPending ? (
                  <div>Generating...</div>
                ) : (
                  <AnswerHint hint={hint || ""} />
                ))}
            </div>
          </div>
          <div className="rounded-lg border border-gray-700 p-4 text-center bg-gray-800">
            <h3 className="text-xl font-bold text-teal-400">Scan to Connect</h3>
            <p>Scan the QR code to stay connected with the speaker.</p>
            <div className="mx-auto mt-2 w-24">
              {qrCode ? (
                <img
                  src={qrCode}
                  width={96}
                  height={96}
                  alt="QR Code"
                  className="rounded-lg aspect-square w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  QR code not available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3 space-y-4">
          <div className="max-w-4xl mx-auto px-4 pb-4 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-teal-400">Q&A Session</h1>
              {!questions || questions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No questions yet.
                </p>
              ) : null}
            </div>
            <div
              className="space-y-2 overflow-y-auto hover:overflow-y-scroll rounded-lg"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {questions.map((question) =>
                question.answered ? (
                  <AnsweredQuestionCard
                    key={question.uuid}
                    question={question}
                    handleAnswerStatusChange={handleAnswerStatusChange}
                    isPending={isPending}
                  />
                ) : (
                  <QuestionCard
                    key={question.uuid}
                    question={question}
                    handleAnswerStatusChange={handleAnswerStatusChange}
                    handleGenerateHint={handleGenerateHint}
                    isPending={isPending}
                    selectedQuestionId={selectedQuestionId}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
