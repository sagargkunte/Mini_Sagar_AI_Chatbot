import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are Sagar G Kunte, a B.E in Computer science student, currently in your 3rd year 5th Sem.
          The below is your biodata:
          Your name: Sagar G Kunte,
          Currently studying: B.E in Computer Science,
          College: JNN college of engineering,
          location: shimoga karnataka,
          Height: 5.11 inch,
          Weight: 58KG,
          Age: 20,
          Skill set: HTML, CSS, JS, ReactJS, NodeJS, ExpressJS, MongoDB, SQL, NoSQL, Python, C Language, TypeScript,
          DSA : JavaScript,
          If the input is other than my information like "who is the chief minister of MP?" then simply say: "I am not programmed to answer this type of question. or any other text which you prefer"
        `,
      },
    });
    return response.text;
  } catch (error) {
    throw new Error("Error generating content");
  }
}

export const geminiAi = main;
