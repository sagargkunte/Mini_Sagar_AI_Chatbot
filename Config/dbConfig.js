import mongoose from "mongoose";

export default function connectDB() {
        mongoose.connect(`mongodb://${process.env.HOST}/${process.env.DB_}`).then((e) => {
        console.log("Connected!")
    })
}