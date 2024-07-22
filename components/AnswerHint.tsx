import { Suspense } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

function HintContent({ hint }: { hint: string }) {
  return (
    <MarkdownPreview
      source={hint || ""}
      style={{ padding: 16, backgroundColor: "#1A202C" }}
    />
  );
}

export default function AnswerHint({ hint }: { hint: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HintContent hint={hint} />
    </Suspense>
  );
}
