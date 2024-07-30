"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcwIcon } from "lucide-react";
import AnswerHint from "./AnswerHint";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { createQuestionsInsertChannelName } from "@/utils/channelName";

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
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
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
      const question = questions[questionId];
      const questionContent = question.content;
      const result = await askGemini(questionContent, question.presentation_id);
      setHint(result.answer);
    });
  };

  const handleCardClick = (questionId: number) => {
    setActiveCardId(questionId);
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
              {questions.map((question, idx) => (
                <Card
                  key={question.uuid}
                  className={
                    activeCardId === idx
                      ? "bg-gray-800 border-blue-500 rounded-lg border"
                      : "bg-gray-800 hover:cursor-pointer rounded-lg border border-gray-700"
                  }
                >
                  <CardContent
                    onClick={() => handleCardClick(idx)}
                    className="p-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="prose prose-invert">
                        <p className="break-words text-lg text-white">
                          {question.content}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        className="ml-2 rounded-lg p-2 hover:bg-gray-600 shadow-lg"
                        onClick={() => handleGenerateHint(idx)}
                        disabled={isPending}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <RefreshCcwIcon className="w-6 h-6 text-white" />
                            </TooltipTrigger>
                            <TooltipContent className="p-2 bg-none rounded-full shadow-md border-none">
                              <p>Generate Answer Hints</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      10 upvotes
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
