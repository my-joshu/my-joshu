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
    question: string
  ): Promise<{ ok: boolean; answer: string }> {
    const response = await fetch(`/api/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const result = await response.json();
    console.log("result", result);

    return result;
  }

  const handleGenerateHint = async (questionId: number) => {
    setSelectedQuestionId(questionId);

    startTransition(async () => {
      const questionContent = questions[questionId].content;
      const result = await askGemini(questionContent);
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
      <main className="container mx-auto grid grid-cols-6 gap-8 py-4 px-4 md:px-6">
        <div className="col-span-5">
          <Button
            className="bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800"
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
              className="mr-2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to Presentations
          </Button>
        </div>
        <div className="col-span-3 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="text-2xl font-bold">Answer Hints</h3>
            <div className="mt-4 space-y-4">
              {selectedQuestionId !== null &&
                (isPending ? (
                  <div>Generating...</div>
                ) : (
                  <AnswerHint hint={hint || ""} />
                ))}
            </div>
          </div>
          <div className="rounded-lg border p-6 text-center">
            <h3 className="text-2xl font-bold">Scan to Connect</h3>
            <p>Scan the QR code to stay connected with the speaker.</p>
            <div className="mx-auto mt-4 w-32">
              {qrCode ? (
                <img
                  src={qrCode}
                  width={128}
                  height={128}
                  alt="QR Code"
                  className="aspect-square w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  QR code not available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-3 space-y-6">
          <div className="max-w-4xl mx-auto px-6 pb-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Q&A Session</h1>
              {!questions || questions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No questions yet.
                </p>
              ) : null}
            </div>
            <div
              className="space-y-4 overflow-y-auto hover:overflow-y-scroll"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {questions.map((question, idx) => (
                <Card
                  key={question.uuid}
                  className={
                    activeCardId === idx
                      ? "border-blue-500"
                      : "hover:cursor-pointer"
                  }
                >
                  <CardContent onClick={() => handleCardClick(idx)}>
                    <div className="flex items-center justify-between">
                      <div className="prose">
                        <p className="pt-4 break-words text-lg">
                          {question.content}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => handleGenerateHint(idx)}
                        disabled={isPending}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <RefreshCcwIcon className="w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent className="p-2 bg-gray-800 dark:bg-gray-900 rounded-md shadow-md">
                              <p>Generate Answer Hints</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
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
