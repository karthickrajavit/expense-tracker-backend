const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
  description: { type: String, required: false, default: "Sample Description" },
});

module.exports = mongoose.model("Category", categorySchema);
