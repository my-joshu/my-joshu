import { GoogleGenerativeAI } from "@google/generative-ai";

// REST
// export async function GET(request: Request) {
//   const start: Date = new Date();

//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: "user",
//             parts: [
//               {
//                 text: "次の回答をキーワードで箇条書きで下さい。SQLとNoSQLの一貫性を保証するためのアプローチの違いについて教えてください",
//               },
//             ],
//             // parts: [{ text: "Give me five subcategories of classic?" }],
//           },
//         ],
//       }),
//     }
//   );

//   const result = await response.json();

//   console.log("result", result);
//   console.log("result", result.candidates, result.candidates[0].content.parts);

//   const finish: Date = new Date();
//   console.log(
//     "start: ",
//     start,
//     ", finish: ",
//     finish,
//     ", diff: ",
//     finish.getTime() - start.getTime()
//   );

//   return Response.json({ ok: true });
// }
// start:  2024-07-15T21:08:11.134Z , finish:  2024-07-15T21:08:12.420Z , diff:  1286

// start:  2024-07-15T21:00:53.225Z , finish:  2024-07-15T21:00:53.226Z , diff:  1

// SDK
export async function GET(request: Request) {
  const start: Date = new Date();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "次の回答をキーワードで箇条書きで下さい。SQLとNoSQLの一貫性を保証するためのアプローチの違いについて教えてください";
  // const prompt = "Give me five subcategories of classic?";

  const result = await model.generateContent(prompt);

  console.log("text", result.response.text());
  console.log("candidates", result.response.candidates);

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
// start:  2024-07-15T21:08:51.032Z , finish:  2024-07-15T21:08:55.390Z , diff:  4358
