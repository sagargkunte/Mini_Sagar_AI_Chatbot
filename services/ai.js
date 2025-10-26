import { config } from "dotenv";
config();
import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER,
  // defaultHeaders: {
  //   "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //   "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  // },
});
async function main(prompt) {
  const completion = await openai.chat.completions.create({
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // console.log(completion.choices[0].message);
  return completion.choices[0].message.content;
}
// main();
export const AI = main;
