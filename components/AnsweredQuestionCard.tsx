import { Undo2 } from "lucide-react";

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

type AnsweredQuestionCardType = {
  question: Tables<"questions">;
  handleAnswerStatusChange: (
    questionId: number,
    isAnswered: boolean
  ) => Promise<void>;
  handleCardClick: (questionId: number) => void;
  isPending: boolean;
  selectedQuestionId: number | null;
};

export const AnsweredQuestionCard = ({
  question,
  handleAnswerStatusChange,
  handleCardClick,
  isPending,
  selectedQuestionId,
}: AnsweredQuestionCardType) => (
  <Card
    key={question.uuid}
    className={
      selectedQuestionId === question.id
        ? "bg-gray-800 border-blue-500 rounded-lg border"
        : "bg-gray-800 hover:cursor-pointer rounded-lg border border-gray-700"
    }
    onClick={() => handleCardClick(question.id)}
  >
    <CardContent className="py-1">
      <div className="flex items-center justify-between">
        <div className="flex flex-col text-left opacity-30 filter grayscale">
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
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAnswerStatusChange(question.id, false);
                  }}
                  disabled={isPending}
                  className="group rounded-lg p-2 hover:bg-orange-500 hover:bg-opacity-5 shadow-lg"
                >
                  <Undo2 className="w-5 h-5 text-white group-hover:text-orange-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                className="p-2 bg-none rounded-full shadow-md border-none"
                align="center"
              >
                Unanswered
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-sm text-gray-500 dark:text-gray-400 opacity-30 filter grayscale">
            10 upvotes
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden py-1 opacity-30 filter grayscale">
        <p className="break-words text-lg text-gray-400">{question.content}</p>
      </div>
    </CardContent>
  </Card>
);
