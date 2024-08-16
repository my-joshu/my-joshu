"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ThumbsUp } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { createQuestionsInsertChannelName } from "@/utils/channelName";
import { formatUtcToLocaleTime } from "@/utils/date";
import { QuestionMeta } from "./QuestionMeta";

// NOTE: Use resetKey to reset input form by server actions: https://github.com/vercel/next.js/discussions/58448#discussioncomment-8459474
const initialState = {
  resetKey: Date.now().toString(),
  message: "",
};

type FormStateType = typeof initialState;

export function QASession({
  presentationId,
  serverQuestions,
  createQuestionBoundArgs,
}: {
  presentationId: string;
  serverQuestions: Tables<"questions">[];
  createQuestionBoundArgs: (
    prevState: FormStateType,
    formData: FormData
  ) => Promise<FormStateType>;
}) {
  const [state, formAction] = useFormState(
    createQuestionBoundArgs,
    initialState
  );
  const [questions, setQuestions] = useState(serverQuestions);

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
    <div className="flex flex-col min-h-screen bg-gray-900 overflow-hidden">
      <main className="container mx-auto grid grid-cols-6 gap-4 py-2 px-2 md:px-4 h-full">
        <div className="col-span-6 max-w-2xl mx-auto p-4 space-y-4 bg-gray-900 text-white rounded-lg">
          <div>
            <h1 className="text-3xl font-bold">Q&A Session</h1>
            <p className="text-gray-400 opacity-80">
              Submit your questions and upvote the ones you're most interested
              in.
            </p>
          </div>
          <form
            action={formAction}
            className="space-y-2 w-full"
            key={state.resetKey}
          >
            <Textarea
              name="content"
              placeholder="Type your question..."
              className="p-3 bg-gray-800 text-white text-md rounded-lg"
              maxLength={160}
            />
            <div className="flex justify-between items-center mt-2">
              {state.message && (
                <div className="text-red-500">{state.message}</div>
              )}
              <div className="flex-1"></div>
              <Button
                type="submit"
                className="py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:from-blue-700 hover:to-teal-500 transition duration-300"
              >
                Submit
              </Button>
            </div>
          </form>
          <div className="overflow-y-auto space-y-2 rounded-lg">
            {questions.map((question) => (
              <Card
                key={question.uuid}
                className="bg-gray-800 text-white rounded-lg border border-gray-700"
              >
                <CardContent className="py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <QuestionMeta
                        author={"Anonymous"}
                        timestamp={formatUtcToLocaleTime(question.created_at)}
                      />
                    </div>
                    <div className="flex space-x-2 items-center">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              className="group rounded-lg p-2 hover:bg-green-500 hover:bg-opacity-5 shadow-lg"
                            >
                              <ThumbsUp className="w-5 h-5 text-white group-hover:text-green-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="p-2 bg-none rounded-full shadow-md border-none"
                            align="center"
                          >
                            Upvote
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        10 upvotes
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden py-1">
                    <p className="break-words text-lg text-white">
                      {question.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
