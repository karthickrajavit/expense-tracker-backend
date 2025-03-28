const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const User = require("../models/User");

const verifyToken = require("../backend/authMiddleware");

// Create Expense
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      // Extract user details from req.user
      const firebaseUID = req.user.uid;
      // Find MongoDB user using firebaseUID
      const user = await User.findOne({ firebaseUid: firebaseUID });
      if (!user) return res.status(404).json({ message: "User not found" });
      let { category, amount, date, tags } = req.body;
      // Check if the amount is a valid number
      amount = parseFloat(amount);
      if (isNaN(amount)) {
        // Check if the amount is a valid number
        return res.status(400).json({ error: "Invalid amount" });
      }
      // Strip the time part from the date
      if (date) {
        date = new Date(date);
        date.setHours(0, 0, 0, 0);
      }
      console.log(date);
      // Check if the category is a valid ObjectId or a name
      let categoryDoc;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        // Check if it's a valid ObjectId (MongoDB ID)
        categoryDoc = await Category.findOne({
          _id: category,
          userId: user._id,
        });
      } else {
        // Assume it's a name and find or create it
        categoryDoc =
          (await Category.findOne({ name: category, userId: user._id })) ||
          (await Category.create({ name: category, userId: user._id }));
      }

      if (!categoryDoc) {
        return res.status(400).json({ error: "Invalid category" });
      }
      const newExpense = new Expense({
        category: categoryDoc._id,
        amount,
        date,
        tags,
        userId: user._id,
      });
      await newExpense.save();
      res.status(201).json(newExpense);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Expenses with Filters
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user) {
      // Extract user details from req.user
      const firebaseUID = req.user.uid;
      // Find MongoDB user using firebaseUID
      const user = await User.findOne({ firebaseUid: firebaseUID });
      if (!user) return res.status(404).json({ message: "User not found" });

      let query = { userId: user._id };
      if (req.query.category) query.category = req.query.category;
      //if (req.query.date) query.date = new Date(req.query.date);
      if (req.query.date) {
        const date = new Date(req.query.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        query.date = { $gte: startOfDay, $lt: endOfDay };
      }
      if (req.query.tags) query.tags = { $in: req.query.tags.split(",") };
      if (req.query.dateRange) {
        const dateRange = req.query.dateRange.split(",");
        query.date = {
          $gte: new Date(dateRange[0]),
          $lt: new Date(new Date(dateRange[1]).setHours(23, 59, 59, 999)),
        };
      }

      const expenses = await Expense.find(query).populate("category");
      const totalExpense = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      res.json({ totalExpense, expenses });
    } else {
      res.status(401).json({ message: "Unauthorized " });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
