require("dotenv").config();
const express = require("express");
const connectDB = require("./database"); // Import the function to get MongoDB URI
const mongoose = require("mongoose");
const serverless = require("serverless-http");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(express.json());
//app.use(cors());

// app.get("/categories", (req, res) => {
//   res.json({ message: "Category list" });
// });

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's URL
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies or credentials
};
app.use(cors(corsOptions));

app.use("/categories", categoryRoutes);
app.use("/expenses", expenseRoutes);

// MongoDB Connection
// const mongoURI = "mongodb://127.0.0.1:27017/expense_tracker";
// Uncomment the below line to connect to MongoDB Atlas
// const mongoURI =
//   "mongodb+srv://karthickrajavit:9UruwTyTyL3FGHO3@expensetracker.s3e5zp3.mongodb.net/expenseTracker?retryWrites=true&w=majority&appName=expenseTracker";
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("MongoDB Connection Error:", err));
(async () => {
  try {
    // Connect to MongoDB using the function that retrieves the URI
    await connectDB();
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
})();

// Middleware to handle errors globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is Running");
});

// Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Only run this if not running in Lambda
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

//Export the app for AWS Lambda
module.exports = app;
// Uncomment the above lines if you want to run the server locally

// Export for AWS Lambda
//exports.handler = serverless({ app });
