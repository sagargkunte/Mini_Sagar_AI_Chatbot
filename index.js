import express from "express";
import router from "./routes/ai.sagar.js";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { geminiAi } from "./services/ai.gemini.js";
import { checkForAuthentication } from "./middlewares/authentications.js";
import { userRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import connectDB from "./Config/dbConfig.js";
// import path from "path";
config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server);

app.set('view engine','ejs');
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());
app.use(checkForAuthentication('token'));

io.on("connection", (socket) => {
  socket.on("userMsg", async (msg) => {
    const aiReplay = await geminiAi(msg);
    // console.log(aiReplay);
    socket.emit('aiReplay',aiReplay);
  });
});

app.get("/", (req, res) => {
  console.log('This is home Route!');
  res.render('index');
});

app.use("/ai", router);

app.use('/user',userRouter);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
