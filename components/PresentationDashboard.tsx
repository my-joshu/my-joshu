"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tables } from "@/types/supabase";

type IconProps = React.ComponentProps<"svg">;

export function PresentationDashboard({
  presentations,
  userId,
}: {
  presentations: Tables<"presentations">[];
  userId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createPresentation = async () => {
    closeModal();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Presentations</h2>
          <Button className="bg-green-600" onClick={openModal}>
            + Create Presentation
          </Button>
        </header>
        <section className="mt-6">
          {presentations.map((presentation) => (
            <Card
              key={presentation.id}
              className="flex items-center justify-between p-4 bg-gray-800"
            >
              <div className="flex items-center space-x-4">
                <PresentationIcon className="w-6 h-6 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-white">
                    {presentation.title}
                  </h3>
                  <p className="text-gray-400">
                    {new Date(presentation.start_time).toLocaleDateString(
                      "en-CA"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ScreenShareIcon className="w-6 h-6 text-gray-400" />
                <SmartphoneIcon className="w-6 h-6 text-gray-400" />
                <ExpandIcon className="w-6 h-6 text-gray-400" />
              </div>
            </Card>
          ))}
        </section>
      </main>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Create Slido</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="datetime-local" />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="datetime-local" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="ml-2 bg-green-600"
                onClick={createPresentation}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
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
