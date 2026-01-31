import mongoose from "mongoose";

export default function connectDB() {
  mongoose.connect(`mongodb+srv://sagargkunte:sagarDev@cluster0.d7akgh8.mongodb.net/miniSagarAIchatbot`).then((e) => {
    console.log("Connected!");
  });
}

// export default function connectDB() {
//   mongoose.connect(`mongodb://localhost:27017/miniSagarAIchatbot`).then((e) => {
//     console.log("Connected!");
//   });
// }