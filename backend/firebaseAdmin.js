import admin from "firebase-admin";
import config from "../config/development.js";

async function initializeFirebaseAdmin() {
  try {
    const configs = config;

    // ✅ Fix: initialize only if credentials are provided
    if (configs && configs.firebaseCredentails) {
      const serviceAccount = configs.firebaseCredentails;

      // Check if the service account credentials are valid
      if (
        !serviceAccount ||
        !serviceAccount.private_key ||
        !serviceAccount.client_email
      ) {
        throw new Error(
          "Firebase service account credentials are not properly configured."
        );
      }

      // Initialize Firebase Admin if not already initialized
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    } else {
      throw new Error("Firebase credentials not found in config.");
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error);
    throw error;
  }
}

// Call the initialization function
await initializeFirebaseAdmin();

export default admin;
