import express from "express";
import router from "./routes/ai.sagar.js";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { AI } from "./services/ai.js";
import { checkForAuthentication } from "./middlewares/authentications.js";
import { userRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import connectDB from "./Config/dbConfig.js";
import passport from "passport";
import { skipRouter } from "./routes/skip.js";
import apminsight from "apminsight";
import { initVectorStore, seedVectorStore } from "./RAG/rag.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);

// Initialize RAG vector store on app startup
(async () => {
  try {
    console.log("🚀 Initializing RAG Vector Store...");
    await initVectorStore();
    console.log("✅ RAG Vector Store initialized successfully");
  } catch (error) {
    console.error(
      "⚠️ Note: RAG Vector Store initialization failed:",
      error.message,
    );
    console.log(
      "💡 This is OK if you haven't set up Qdrant yet. The app will still work!",
    );
    // Continue even if RAG fails - the app can still function with basic AI responses
  }
})();

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(checkForAuthentication("user"));
app.use("/skip", skipRouter);

io.on("connection", (socket) => {
  socket.on("userMsg", async (msg) => {
    try {
      console.log(msg);
      const { text, source } = msg;
      if (source == "voice") {
        console.log("This is voice text ", text);
      }
      if (source == "text") {
        console.log("This is message text ", text);
      }
      const aiReplay = await AI(text);

      console.log(aiReplay);
      socket.emit("aiReplay", aiReplay);
    } catch (e) {
      console.log("This is error inside the socket user message");
    }
  });
});

app.get("/", (req, res) => {
  console.log("This is home Route!");
  res.render("index");
});

app.use("/ai", router);

app.use("/user", userRouter);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
