"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RefreshCcwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export default function Sample() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [hints, setHints] = useState<{ [key: number]: string[] }>({});

  const questions = [
    "What inspired you to start this project?",
    "How can I get involved in the project?",
    "What are the long-term goals for the project?",
  ];

  function generateHintsForQuestion(questionId: number) {
    const questionContent = questions[questionId];
    return Array.from(
      { length: 3 },
      (_, i) => `Hint ${i + 1} for '${questionContent}'`
    );
  }

  const handleGenerateHint = (questionId: number) => {
    setSelectedQuestionId(questionId);
    if (!hints[questionId] || hints[questionId].length < 3) {
      const newHints = generateHintsForQuestion(questionId);
      setHints({ ...hints, [questionId]: newHints });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="container mx-auto grid grid-cols-5 gap-8 py-12 px-4 md:px-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="text-2xl font-bold">Answer Hints</h3>
            <div className="mt-4 space-y-4">
              {selectedQuestionId !== null && (
                <>
                  <h4 className="text-lg font-medium">
                    {questions[selectedQuestionId]}
                  </h4>
                  {hints[selectedQuestionId]?.map((hint, i) => (
                    <p key={i}>{hint}</p>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-6 text-center">
            <h3 className="text-2xl font-bold">Scan to Connect</h3>
            <p>Scan the QR code to stay connected with the speaker.</p>
            <div className="mx-auto mt-4 w-32">
              <img
                src="/placeholder.svg"
                width={128}
                height={128}
                alt="QR Code"
                className="aspect-square w-full object-contain"
              />
            </div>
          </div>
        </div>
        <div className="col-span-3 space-y-6">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Q&A Session</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Submit your questions and upvote the ones you're most interested
                in.
              </p>
            </div>
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <Card key={idx}>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="prose">
                        <p>{q}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto"
                        onClick={() => handleGenerateHint(idx)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <RefreshCcwIcon className="w-4 h-4" />
                            </TooltipTrigger>
                            <TooltipContent>
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
