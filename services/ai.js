import { config } from "dotenv";
config();
import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER,
});

async function main(prompt) {
  // Wrap your parameters in chatGenerationParams
  console.log("user prompt is ", prompt);
  const completion = await client.chat.send({
    chatGenerationParams: {
      model: "stepfun/step-3.5-flash:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    },
  });
  console.log("Response from AI:", completion.choices[0].message.content);
  return completion.choices[0].message.content;
}

export const AI = main;
// (async () => {
//   const res = await main("hello");
//   console.log(res);
// })();