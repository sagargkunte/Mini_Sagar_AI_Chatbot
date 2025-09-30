import mongoose from "mongoose";

export default function connectDB() {
        mongoose.connect(`mongodb://localhost:27017/miniSagarAIchatbot`).then((e) => {
        console.log("Connected!")
    })
}