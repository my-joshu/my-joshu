"use client";

import { useState } from "react";
import Link from "next/link";

import { Tables } from "@/types/supabase";
import { createPresentation } from "@/app/presentations/actions";
import { formatUtcToLocaleTimezone } from "@/utils/date";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { PresentationFileUploader } from "@/components/PresentationFileUploader";

type IconProps = React.ComponentProps<"svg">;

export function PresentationDashboard({
  presentations,
  speakerId,
}: {
  presentations: Tables<"presentations">[];
  speakerId: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDescription("");
  };

  const createPresentationWithSpeakerId = createPresentation.bind(
    null,
    speakerId
  );

  const handleFileProcessed = (text: string) => {
    setDescription((prevState: string) => prevState + text);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createPresentationWithSpeakerId(formData);
    closeModal();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <main className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gradient">Presentations</h2>
          <Button
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 transition duration-300"
            onClick={openModal}
          >
            + Create Presentation
          </Button>
        </header>
        <section
          className="space-y-2 overflow-y-auto hover:overflow-y-scroll rounded-lg"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {presentations.map((presentation) => (
            <Link
              key={presentation.id}
              href={`/presentations/${presentation.id}`}
            >
              <Card className="flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <PresentationIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-white">
                      {presentation.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {formatUtcToLocaleTimezone(presentation.start_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ScreenShareIcon className="w-5 h-5 text-gray-400" />
                  <SmartphoneIcon className="w-5 h-5 text-gray-400" />
                  <ExpandIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </section>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="bg-gray-900 text-white">
              <form onSubmit={submitHandler}>
                <DialogTitle className="text-lg font-bold mb-2">
                  Create Presentation
                </DialogTitle>
                <div className="p-2 space-y-2">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter title"
                      className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:border-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description or upload slides"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:border-gray-700"
                    />
                  </div>
                  <PresentationFileUploader
                    onFileProcessed={handleFileProcessed}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="datetime-local"
                        className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:border-gray-700 dark:[color-scheme:dark]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="datetime-local"
                        className="flex-1 p-2 rounded-lg bg-gray-800 text-white focus:border-gray-700 dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="text-white border border-gray-700 bg-gray-800 hover:bg-gray-700 transition duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-teal-600 transition duration-300"
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}

function ExpandIcon(props: IconProps) {
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
      <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
      <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
      <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
      <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
    </svg>
  );
}

function PresentationIcon(props: IconProps) {
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
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

function ScreenShareIcon(props: IconProps) {
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
      <path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="m17 8 5-5" />
      <path d="M17 3h5v5" />
    </svg>
  );
}

function SmartphoneIcon(props: IconProps) {
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
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
