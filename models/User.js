import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Store Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
