import { connect } from "mongoose";
import config from "./config/development.js"; // Import the configuration file

// AWS Secrets Manager client

async function getMongoURI() {
  try {
    // const env = process.env.NODE_ENV || "development";
    const mongoUri = config.mongoUri;

    if (!mongoUri) {
      throw new Error("MongoDB URI not found in configuration");
    }
    return mongoUri;
  } catch (error) {
    console.error("Error retrieving MongoDB URI:", error);
    throw new Error("Failed to fetch MongoDB URI");
  }
}

async function connectDB() {
  try {
    const mongoURI = await getMongoURI();
    await connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

export default connectDB;
