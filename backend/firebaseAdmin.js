const admin = require("firebase-admin");
const AWS = require("aws-sdk");

// Configure AWS Secrets Manager
const secretsManager = new AWS.SecretsManager({
  region: "ap-south-1", // Replace with your AWS region
});

async function initializeFirebaseAdmin() {
  try {
    // Retrieve the secret from AWS Secrets Manager
    const secretName = "prod/firebase-admin-secret"; // Replace with your secret name
    const secretValue = await secretsManager
      .getSecretValue({ SecretId: secretName })
      .promise();

    // Parse the secret value (assuming it's stored as JSON)
    const serviceAccount = JSON.parse(secretValue.SecretString);

    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount), 
      });
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

// Call the initialization function
initializeFirebaseAdmin();

module.exports = admin;
