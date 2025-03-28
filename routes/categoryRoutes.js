const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const User = require("../models/User");
const admin = require("../backend/firebaseAdmin");
const verifyToken = require("../backend/authMiddleware");

// Create Category
router.post("/", verifyToken, async (req, res) => {
  try {
    // // Extract Firebase ID token from Authorization header
    // const token = req.headers.authorization?.split(" ")[1];
    // if (!token) return res.status(401).json({ message: "Unauthorized" });

    // // Verify Firebase token and extract firebaseUID
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // const firebaseUID = decodedToken.uid;

    // // Find MongoDB user using firebaseUID
    // const user = await User.findOne({ firebaseUID });
    // if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const userObject = req.user;
    const firebaseUID = userObject.uid;
    const user = await User.findOne({ firebaseUid: firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Check if the category name is already taken  by the user
    const categoryExists = await Category.findOne({
      name: req.body.name,
      userId: user._id, // Check for category name linked to the user's MongoDB _id
    });
    if (categoryExists) {
      return res.status(400).json({ message: "Category name already taken" });
    }
    // Create a new category linked to the user's MongoDB _id
    const newCategory = new Category({
      userId: user._id, // Use MongoDB _id for reference
      name: req.body.name,
    });

    // Save category in the database
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Categories
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      // Extract user details from req.user
      const firebaseUID = req.user.uid;
      // Find MongoDB user using firebaseUID
      const user = await User.findOne({ firebaseUid: firebaseUID });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Get all categories linked to the user's MongoDB _id
      const categories = await Category.find({ userId: user._id });
      res.json(categories);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Category by Name
router.delete("/:name", verifyToken, async (req, res) => {
  try {
    // Extract Firebase ID token from Authorization header
    if (req.user) {
      // Extract user details from req.user
      const firebaseUID = req.user.uid;
      // Find MongoDB user using firebaseUID
      const user = await User.findOne({ firebaseUid: firebaseUID });
      if (!user) return res.status(404).json({ message: "User not found" });
      const category = await Category.findOneAndDelete({
        name: req.params.name,
        userId: user._id,
      });
      //const category = await Category.findOneAndDelete({ name: req.params.name });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
