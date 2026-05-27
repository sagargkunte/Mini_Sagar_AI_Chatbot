import mongoose from "mongoose";

export default function connectDB() {
  mongoose.connect(process.env.MONGODB_URI).then((e) => {
    console.log("Database Connected!");
  });
}
