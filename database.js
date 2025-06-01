const mongoose = require("mongoose");
const AWS = require("aws-sdk");

// AWS Secrets Manager client
const secretsManager = new AWS.SecretsManager({ region: "ap-south-1" });

async function getMongoURI() {
  try {
    const secretData = await secretsManager
      .getSecretValue({ SecretId: "prod/MongoAtlasCredential" })
      .promise();
    console.log("Secret Data:", secretData);
    if ("SecretString" in secretData) {
      const secrets = JSON.parse(secretData.SecretString);
      return secrets.MONGO_URI;
    }
  } catch (error) {
    console.error("Error retrieving MongoDB URI:", error);
    throw new Error("Failed to fetch MongoDB URI");
  }
}

async function connectDB() {
  try {
    const mongoURI = await getMongoURI();
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
