import path from "path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { config } from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let vectorStoreInstance = null;

const getEmbeddingModel = () =>
  new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    apiKey: process.env.HF_API_KEY,
  });

// Load resume from JSON file
const loadResumeFromJSON = async () => {
  try {
    const resumePath = path.join(process.cwd(), "data/resume.json");
    const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf-8"));

    // Convert resume data to documents
    const documents = [];

    // Personal info
    documents.push(
      new Document({
        pageContent: `Name: ${resumeData.personalInfo.name}\nTitle: ${resumeData.personalInfo.title}\nSummary: ${resumeData.personalInfo.summary}`,
        metadata: { section: "personal" },
      }),
    );

    // Experience
    resumeData.experience.forEach((exp) => {
      documents.push(
        new Document({
          pageContent: `Experience: ${exp.role} at ${exp.company} (${exp.duration})\nDescription: ${exp.description}\nSkills: ${exp.skills.join(", ")}`,
          metadata: { section: "experience", company: exp.company },
        }),
      );
    });

    // Skills
    const skillsText = Object.entries(resumeData.skills)
      .map(
        ([category, skills]) =>
          `${category}: ${Array.isArray(skills) ? skills.join(", ") : skills}`,
      )
      .join("\n");
    documents.push(
      new Document({
        pageContent: skillsText,
        metadata: { section: "skills" },
      }),
    );

    // Projects
    resumeData.projects.forEach((project) => {
      documents.push(
        new Document({
          pageContent: `Project: ${project.name}\nDescription: ${project.description}\nTechnologies: ${project.technologies.join(", ")}\nFeatures: ${project.features.join(", ")}\nHighlights: ${project.highlights}`,
          metadata: { section: "projects", projectName: project.name },
        }),
      );
    });

    // Education
    resumeData.education.forEach((edu) => {
      documents.push(
        new Document({
          pageContent: `Education: ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.duration})`,
          metadata: { section: "education" },
        }),
      );
    });

    // Certifications
    documents.push(
      new Document({
        pageContent: `Certifications: ${resumeData.certifications.join(", ")}`,
        metadata: { section: "certifications" },
      }),
    );

    return documents;
  } catch (error) {
    console.error("Error loading resume from JSON:", error);
    return [];
  }
};

// Run this ONCE to seed the vector store
export const seedVectorStore = async () => {
  try {
    const docs = await loadResumeFromJSON();

    if (docs.length === 0) {
      console.log("⚠️ No documents found to seed");
      return;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });
    const chunks = await splitter.splitDocuments(docs);

    await QdrantVectorStore.fromDocuments(chunks, getEmbeddingModel(), {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: "miniSagarAIchatbot",
    });

    console.log("✅ Seeding done with resume data");
  } catch (error) {
    console.error("Error seeding vector store:", error);
  }
};

// Use this in your app after seeding
export const initVectorStore = async () => {
  if (vectorStoreInstance) return vectorStoreInstance;

  vectorStoreInstance = await QdrantVectorStore.fromExistingCollection(
    getEmbeddingModel(),
    {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: "miniSagarAIchatbot",
    },
  );

  return vectorStoreInstance;
};

export const getContext = async (userQuery) => {
  if (!vectorStoreInstance) await initVectorStore();

  const results = await vectorStoreInstance.similaritySearch(userQuery, 3);

  return results
    .map(
      (r) =>
        `Page Content: ${r.pageContent}\nPage Number: ${
          r.metadata?.loc?.pageNumber || r.metadata?.page_label || "N/A"
        }\nFile Location: ${r.metadata?.source || "N/A"}`,
    )
    .join("\n\n\n");
};
