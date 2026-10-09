import { config } from "dotenv";
config();

import Groq from "groq-sdk";
import SYSTEM_PROMPT from "../utils/systemPrompt.js";
import { getContext } from "../RAG/rag.js";
import fs from "fs";
import path from "path";

// Load social links from resume
function loadSocialLinks() {
  try {
    const resumePath = path.join(process.cwd(), "data", "resume.json");

    const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf-8"));

    return resumeData.personalInfo?.socialLinks || {};
  } catch (error) {
    console.error("Error loading social links:", error);
    return {};
  }
}

// Check for social link queries
function isSocialLinkQuery(prompt) {
  const socialLinkKeywords = [
    "github",
    "linkedin",
    "twitter",
    "portfolio",
    "website",
    "personal website",
    "contact",
    "email",
    "connect with",
    "social media",
    "follow me",
    "visit my",
    "check my",
  ];

  const lowerPrompt = prompt.toLowerCase();

  return socialLinkKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

// Get social link response
function getSocialLinkResponse(prompt) {
  const socialLinks = loadSocialLinks();
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("github")) {
    return `Check out my GitHub profile: ${
      socialLinks.github || "Not available"
    }\n\nThere you'll find all my projects and contributions! 🚀`;
  }

  if (lowerPrompt.includes("linkedin")) {
    return `Connect with me on LinkedIn: ${
      socialLinks.linkedin || "Not available"
    }\n\nLet's network! 💼`;
  }

  if (lowerPrompt.includes("twitter")) {
    return `Follow me on Twitter: ${
      socialLinks.twitter || "Not available"
    }\n\nI share tech updates and insights there! 🐦`;
  }

  if (lowerPrompt.includes("portfolio")) {
    return `Visit my portfolio: ${
      socialLinks.portfolio || "Not available"
    }\n\nCheck out my work and projects there! 💻`;
  }

  if (lowerPrompt.includes("email") || lowerPrompt.includes("contact")) {
    return `You can reach me at: ${
      socialLinks.email || "Not available"
    }\n\nFeel free to get in touch! 📧`;
  }

  return [
    "Here are my social links and contact info:",
    "",
    `🐙 GitHub: ${socialLinks.github || "Not available"}`,
    `💼 LinkedIn: ${socialLinks.linkedin || "Not available"}`,
    `🐦 Twitter: ${socialLinks.twitter || "Not available"}`,
    `💻 Portfolio: ${socialLinks.portfolio || "Not available"}`,
    `📧 Email: ${socialLinks.email || "Not available"}`,
    "",
    "Feel free to reach out! 🙌",
  ].join("\n");
}

// Detect resume-related queries
function isResumeQuery(prompt) {
  const resumeKeywords = [
    "resume",
    "tell me about yourself",
    "tell me from your resume",
    "your resume",
    "your experience",
    "your skills",
    "your projects",
    "your education",
    "what have you worked on",
    "your background",
    "your qualification",
    "certifications",
    "work experience",
    "technical skills",
    "programming languages",
    "technologies you know",
    "your expertise",
  ];

  const lowerPrompt = prompt.toLowerCase();

  return resumeKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

// Initialize Groq client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate AI response
async function main(prompt) {
  try {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string.");
    }

    // Handle social link queries without calling the AI API
    if (isSocialLinkQuery(prompt)) {
      console.log("Social Link Query Detected");

      const linkResponse = getSocialLinkResponse(prompt);

      console.log("Link Response:", linkResponse);

      return linkResponse;
    }

    // Retrieve RAG context for resume-related questions
    const shouldGetContext = isResumeQuery(prompt);
    let context = "";

    if (shouldGetContext) {
      try {
        context = await getContext(prompt);
      } catch (error) {
        console.error("RAG context retrieval failed:", error);
      }
    }

    console.log("Is Resume Query:", shouldGetContext);
    console.log("Context Retrieved:", context ? "Yes" : "No");

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    // Add relevant resume context when available
    if (context && context.trim().length > 20) {
      console.log("Adding context to message...");

      messages.push({
        role: "system",
        content: `Relevant information from Sagar's resume:\n\n${context}`,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    // Call Groq
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("Groq returned an empty response.");
    }

    console.log("AI Response:", aiResponse);

    return aiResponse;
  } catch (error) {
    console.error("Error in Groq AI service:", error);
    throw error;
  }
}

export const AI = main;
