import OpenAI from "openai";

export async function GET() {
  const start: Date = new Date();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Say this is a test" }],
  });

  console.log("result", result);

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
