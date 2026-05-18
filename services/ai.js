import { config } from "dotenv";
config();
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import SYSTEM_PROMPT from "../utils/systemPrompt.js";
import { getContext } from "../RAG/rag.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load social links from resume
function loadSocialLinks() {
  try {
    const resumePath = path.join(process.cwd(), "data/resume.json");
    const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf-8"));
    return resumeData.personalInfo.socialLinks || {};
  } catch (error) {
    console.error("Error loading social links:", error);
    return {};
  }
}

// Check for social link queries
function isSocialLinkQuery(prompt) {
  const socialLinkKeywords = [
    "github",
    "github link",
    "my github",
    "github profile",
    "linkedin",
    "linkedin link",
    "my linkedin",
    "twitter",
    "twitter link",
    "portfolio",
    "portfolio link",
    "my portfolio",
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

  // Check what link is being asked for
  if (lowerPrompt.includes("github")) {
    return `Check out my GitHub profile: ${socialLinks.github || "Not available"}\n\nThere you'll find all my projects and contributions! 🚀`;
  } else if (lowerPrompt.includes("linkedin")) {
    return `Connect with me on LinkedIn: ${socialLinks.linkedin || "Not available"}\n\nLet's network! 💼`;
  } else if (lowerPrompt.includes("twitter")) {
    return `Follow me on Twitter: ${socialLinks.twitter || "Not available"}\n\nI share tech updates and insights there! 🐦`;
  } else if (lowerPrompt.includes("portfolio")) {
    return `Visit my portfolio: ${socialLinks.portfolio || "Not available"}\n\nCheck out my work and projects there! 💻`;
  } else if (lowerPrompt.includes("email") || lowerPrompt.includes("contact")) {
    return `You can reach me at: ${socialLinks.email || "Not available"}\n\nFeel free to get in touch! 📧`;
  } else {
    // Return all links if asking for general contact/social info
    let response = "Here are my social links and contact info:\n\n";
    response += `🐙 GitHub: ${socialLinks.github || "Not available"}\n`;
    response += `💼 LinkedIn: ${socialLinks.linkedin || "Not available"}\n`;
    response += `🐦 Twitter: ${socialLinks.twitter || "Not available"}\n`;
    response += `💻 Portfolio: ${socialLinks.portfolio || "Not available"}\n`;
    response += `📧 Email: ${socialLinks.email || "Not available"}\n\n`;
    response += "Feel free to reach out! 🙌";
    return response;
  }
}

// Enhanced resume query detection
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

const client = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

async function main(prompt) {
  try {
    // Check if it's a social link query first
    if (isSocialLinkQuery(prompt)) {
      console.log("Social Link Query Detected");
      const linkResponse = getSocialLinkResponse(prompt);
      console.log("Link Response:", linkResponse);
      return linkResponse;
    }

    // Get context if it's a resume-related query
    const shouldGetContext = isResumeQuery(prompt);
    const context = shouldGetContext ? await getContext(prompt) : "";

    console.log("Is Resume Query:", shouldGetContext);
    console.log("Context Retrieved:", context ? "Yes" : "No");

    let messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    // Add context if it exists and is meaningful
    if (context && context.trim().length > 20) {
      console.log("Adding context to message...");
      messages.splice(1, 0, {
        role: "system",
        content: `Here's relevant information to help answer the question:\n\n${context}`,
      });
    }

    const response = await client.chat.completions.create({
      messages,
      model: "llama3.1-8b",
    });

    const aiResponse = response.choices[0].message.content;
    console.log("AI Response:", aiResponse);
    return aiResponse;
  } catch (error) {
    console.error("Error in AI service:", error);
    throw error;
  }
}

export const AI = main;
