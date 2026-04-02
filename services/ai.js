import { config } from "dotenv";
config();
// import { OpenRouter } from "@openrouter/sdk";

// const client = new OpenRouter({
//   apiKey: process.env.OPEN_ROUTER,
// });

// async function main(prompt) {
//   // Wrap your parameters in chatGenerationParams
//   console.log("user prompt is ", prompt);
//   const completion = await client.chat.send({
//     chatGenerationParams: {
//       model: "openai/gpt-oss-20b:free",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       stream: false,
//     },
//   });
//   console.log("Response from AI:", completion.choices[0].message.content);
//   return completion.choices[0].message.content;
// }

// export const AI = main;
// (async () => {
//   const res = await main("hello");
//   console.log(res);
// })();

import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function main(prompt) {
  const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });
  console.log(response.output_text);
  return response.output_text;
}

export const AI = main;