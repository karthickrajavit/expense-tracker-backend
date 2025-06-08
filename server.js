import config from "./config/development.js";
import express from "express";
import connectDB from "./database.js"; // Adjust the path if needed and ensure default export
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

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

const PORT = config.Port; // Default to 5000 if not specified
console.log(`API Port: ${config.Port}`);
app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});

//Export the app for AWS Lambda
// module.exports = app;
export default app;
// Uncomment the above lines if you want to run the server locally

// Export for AWS Lambda
//exports.handler = serverless({ app });
