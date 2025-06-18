import express from "express";
const router = express.Router();
import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import verifyToken from "../backend/authMiddleware.js";

// Create Expense
router.get("/summary-by-category", verifyToken, async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    let userDetails = null;
    console.log("Request Query:", req.query);
    if (userId) {
      // const firebaseUID = req.user.uid;
      const firebaseUID = userId;
      console.log("Firebase UID:", firebaseUID);
      userDetails = await User.findOne({ firebaseUid: firebaseUID });
      console.log("User Details:", userDetails);
      if (!userDetails)
        return res.status(404).json({ message: "User not found" });
    }

    if (!month || !year || !userId) {
      return res
        .status(400)
        .json({ message: "month, year, and userId are required" });
    }

    // Convert to date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1); // 1st of next month

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: userDetails._id, // Optional: filter by user
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories", // Ensure this matches your Category collection name
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 0,
          categoryId: "$categoryDetails._id",
          categoryName: "$categoryDetails.name",
          totalAmount: 1,
          count: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Error fetching summary by category:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
