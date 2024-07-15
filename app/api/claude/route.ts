import Anthropic from "@anthropic-ai/sdk";

export async function GET() {
  const start: Date = new Date();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    system: "Respond only with short poems.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Why is the ocean salty?",
          },
        ],
      },
    ],
  });

  console.log(msg);

  const finish: Date = new Date();
  console.log(
    "start: ",
    start,
    ", finish: ",
    finish,
    ", diff: ",
    finish.getTime() - start.getTime()
  );
  return Response.json({ ok: true });
}
