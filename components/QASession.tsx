"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { createQuestionsInsertChannelName } from "@/utils/channelName";

// NOTE: Use resetKey to reset input form by server actions: https://github.com/vercel/next.js/discussions/58448#discussioncomment-8459474
const initialState = {
  resetKey: Date.now().toString(),
  message: "",
};

type FormStateType = typeof initialState;
type IconProps = React.ComponentProps<"svg">;

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

  // TODO Show error message for input form

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Q&A Session</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Submit your questions and upvote the ones you're most interested in.
        </p>
      </div>
      <form
        action={formAction}
        className="flex items-center gap-2"
        key={state.resetKey}
      >
        <Input
          name="content"
          type="text"
          placeholder="Ask a question..."
          className="flex-1"
          required
        />
        <Button type="submit">Submit</Button>
      </form>
      <p aria-live="polite" className="sr-only">
        {state.message}
      </p>
      <div
        className="space-y-4 overflow-y-auto hover:overflow-y-scroll"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {questions.map((q) => (
          <Card key={q.uuid}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="prose prose-stone">
                  <p>{q.content}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ThumbsUpIcon className="w-5 h-5" />
                  <span className="sr-only">Upvote</span>
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
  );
}

function ThumbsUpIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}
