import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { config } from "dotenv";

config();

let vectorStoreInstance = null;

const getEmbeddingModel = () =>
  new HuggingFaceInferenceEmbeddings({
    model: "sentence-transformers/all-MiniLM-L6-v2", // ✅ fixed
    apiKey: process.env.HF_API_KEY,
  });

// Run this ONCE to seed the vector store
export const seedVectorStore = async () => {
  const pdfPath = path.join(process.cwd(), "RAG/sagar(Resume).pdf");
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 400,
  });
  const chunks = await splitter.splitDocuments(docs);

  await QdrantVectorStore.fromDocuments(chunks, getEmbeddingModel(), {
    url: "http://localhost:6333",
    collectionName: "miniSagarAIchatbot",
  });

  console.log("✅ Seeding done");
};

// Use this in your app after seeding
export const initVectorStore = async () => {
  if (vectorStoreInstance) return vectorStoreInstance;

  vectorStoreInstance = await QdrantVectorStore.fromExistingCollection(
    getEmbeddingModel(),
    {
      url: "http://localhost:6333",
      collectionName: "miniSagarAIchatbot",
    }
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
        }\nFile Location: ${r.metadata?.source || "N/A"}`
    )
    .join("\n\n\n");
};