import { config } from "dotenv";
config();
import OpenAI from "openai";
import SYSTEM_PROMPT from "../utils/systemPrompt.js";
import { getContext } from "../RAG/rag.js";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function main(prompt) {
  // const context = await getContext(prompt);
  // console.log("Context:", context);
  // const FINAL_PROMPT = `${SYSTEM_PROMPT}\n\nYou answer the user based on the following context and navigate the user to open the right page number to know more.\n\nContext:\n${context}`;
  const FINAL_PROMPT = SYSTEM_PROMPT;

  const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    // messages: [
    //   { role: "system", content: FINAL_PROMPT },
    //   { role: "user", content: prompt },
    // ],
    input: prompt
  });
  console.log(response.output_text);
  return response.output_text;
}


(function () {
  main("hi")
})();
// export const AI = main;