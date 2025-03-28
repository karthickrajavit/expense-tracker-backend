const admin = require("firebase-admin");
const serviceAccount = require("./expense-tracker-9295e-firebase-adminsdk-fbsvc-956bf0e465.json"); // Update with your service account file

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
