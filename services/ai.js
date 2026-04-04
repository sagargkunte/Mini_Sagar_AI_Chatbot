import { config } from "dotenv";
config();
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import SYSTEM_PROMPT from "../utils/systemPrompt.js";
import { getContext } from "../RAG/rag.js";

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY, 
});

async function main(prompt) {
  const context = await getContext(prompt);
  console.log("Context:", context);
  const FINAL_PROMPT = `${SYSTEM_PROMPT}\n\nYou answer the user based on the following context and navigate the user to open the right page number to know more.\n\nContext:\n${context}`;
  // const FINAL_PROMPT = SYSTEM_PROMPT;

  const response = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt },
      { role: 'system', content: FINAL_PROMPT }
    ],
    model: 'llama3.1-8b',
  });
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}


// (function () {
//   main("hi")
// })();
export const AI = main;