require("dotenv").config();
const path = require("path");
const admin = require("firebase-admin");


if (!admin.apps.length) {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!serviceAccountPath) {
    console.error("✗ GOOGLE_APPLICATION_CREDENTIALS not found in .env");
    process.exit(1);
  }

  try {
    // Convert relative path to absolute path
    const absolutePath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(__dirname, "..", serviceAccountPath);

    const serviceAccount = require(absolutePath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId || serviceAccount.project_id,
    });
    console.log("✓ Firebase initialized successfully");
  } catch (error) {
    console.error("✗ Firebase initialization failed:", error.message);
    process.exit(1);
  }
}

// Test FCM connection (not Firestore)
const messaging = admin.messaging();
console.log("MEssaging: ", messaging);

console.log("✓ Firebase Cloud Messaging (FCM) is ready!");
console.log("✓ You can now send push notifications!");
process.exit(0);
