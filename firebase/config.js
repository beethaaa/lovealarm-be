var admin = require("firebase-admin");
const path = require("path");

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

// const sendNotification = async (registrationToken, title, message) => {
//   const messageSend = {
//     token: registrationToken,
//     notification: {
//       title: title,
//       body: message,
//     },
//     data: {
//       key1: "",
//       key2: "",
//     },
//     android: {
//       priority: "high",
//     },
//     apns: {
//       payload: {
//         aps: {},
//       },
//     },
//   };

//   try {
//     const response = await admin.messaging().send(messageSend);
//     console.log("Successfully sent message:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending message:", error);
//     throw error;
//   }
// };



const toStringData = (data = {}) =>
  Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]));

// returns: Promise<string> (messageId)
const sendNotification = async (registrationToken, title, message, data = {}) => {
  const messageSend = {
    token: registrationToken,
    notification: {
      title,
      body: message,
    },
    data: toStringData(data),
    android: { priority: "high" },
    apns: { payload: { aps: {} } },
  };

  return admin.messaging().send(messageSend);
};

// returns: Promise<BatchResponse>
const sendMulticastNotification = async (tokens = [], title, message, data = {}) => {
  if (!tokens.length) {
    return { successCount: 0, failureCount: 0, responses: [] };
  }

  return admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body: message,
    },
    data: toStringData(data),
    android: { priority: "high" },
    apns: { payload: { aps: {} } },
  });
};

module.exports = {
  admin,
  sendNotification,
  sendMulticastNotification,
};