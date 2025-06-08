import admin from "./firebaseAdmin.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer Token
    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token provided" });

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Store user details in request

    next(); // Move to next middleware
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ error: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
