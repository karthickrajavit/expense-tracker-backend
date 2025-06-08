import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  description: { type: String, required: false, default: "Sample Description" },
});

export default mongoose.model("Category", categorySchema);
