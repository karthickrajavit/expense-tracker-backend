const admin = require("firebase-admin");

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

module.exports = admin;
