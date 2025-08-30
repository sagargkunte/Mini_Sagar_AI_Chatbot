import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyDFUJ4g6DnkxmckLJL6q-UdQFtdk6GrXaE";
const ai = new GoogleGenAI({ apiKey });

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
          Height: 5.11 inch,
          Weight: 58KG,
          Age: 20,
          Skill set: HTML, CSS, JS, ReactJS, NodeJS, ExpressJS, MongoDB, SQL
          If the input is other than my information like "who is the chief minister of MP?" then simply say: "I am not programmed to answer this type of question."
        `,
      },
    });
    return response.text;
  } catch (error) {
    throw new Error('Error generating content');
  }
}

export const geminiAi = main;
