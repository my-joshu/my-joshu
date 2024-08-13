import { CheckIcon, Lightbulb } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { formatUtcToLocaleTime } from "@/utils/date";
import { QuestionMeta } from "./QuestionMeta";

type QuestionCardType = {
  question: Tables<"questions">;
  handleGenerateHint: (questionId: number) => Promise<void>;
  handleAnswerStatusChange: (
    questionId: number,
    isAnswered: boolean
  ) => Promise<void>;
  isPending: boolean;
  selectedQuestionId: number | null;
};

export const QuestionCard = ({
  question,
  handleGenerateHint,
  handleAnswerStatusChange,
  isPending,
  selectedQuestionId,
}: QuestionCardType) => (
  <Card
    key={question.uuid}
    className={
      selectedQuestionId === question.id
        ? "bg-gray-800 border-blue-500 rounded-lg border"
        : "bg-gray-800 hover:cursor-pointer rounded-lg border border-gray-700"
    }
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
                  className="group rounded-lg p-2 hover:bg-yellow-400 hover:bg-opacity-5 shadow-lg"
                  onClick={() => handleGenerateHint(question.id)}
                  disabled={isPending}
                >
                  <Lightbulb className="w-5 h-5 text-white group-hover:text-yellow-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="p-2 bg-none rounded-full shadow-md border-none"
                align="center"
              >
                Answer Hints
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => handleAnswerStatusChange(question.id, true)}
                  disabled={isPending}
                  className="group rounded-lg p-2 hover:bg-green-500 hover:bg-opacity-5 shadow-lg"
                >
                  <CheckIcon className="w-5 h-5 text-white group-hover:text-green-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="p-2 bg-none rounded-full shadow-md border-none"
                align="center"
              >
                Answered
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            10 upvotes
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden py-1">
        <p className="break-words text-lg text-white">{question.content}</p>
      </div>
    </CardContent>
  </Card>
);
