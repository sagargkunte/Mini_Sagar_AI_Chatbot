import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.role != "Guest";
      },
    },
    email: {
      type: String,
      required: function () {
        return this.role != "guest";
      },
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.login == "manual";
      },
    },
    login: {
      type: String,
      enum: ["mmnual","google","github"],
      default: "manual",
    },
    role: {
      type: String,
      enum: ["guest","user"],
      default: "guest"
    }
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
