import express from "express";
import router from "./routes/ai.sagar.js";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { geminiAi } from "./services/ai.gemini.js";
import { checkForAuthentication } from "./middlewares/authentications.js";
import { userRouter } from "./routes/user.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);
config();

app.set('view engine','ejs');
app.use(express.json());
app.use(checkForAuthentication());

io.on("connection", (socket) => {
  socket.on("userMsg", async (msg) => {
    const aiReplay = await geminiAi(msg);
    // console.log(aiReplay);
    socket.emit('aiReplay',aiReplay);
  });
});

app.get("/", (req, res) => {

  res.render('index');
});

app.use("/ai", router);

app.use('/user',userRouter);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
