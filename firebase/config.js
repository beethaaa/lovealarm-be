var admin = require("firebase-admin");
const path = require("path");

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const googleApplicationCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (
    googleApplicationCredentials &&
    !path.isAbsolute(googleApplicationCredentials)
  ) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
      __dirname,
      "..",
      googleApplicationCredentials,
    );
  }

  if (serviceAccountJson) {
    const parsedServiceAccount = JSON.parse(serviceAccountJson);

    if (parsedServiceAccount.private_key) {
      parsedServiceAccount.private_key =
        parsedServiceAccount.private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(parsedServiceAccount),
      projectId: projectId || parsedServiceAccount.project_id,
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...(projectId ? { projectId } : {}),
    });
  }
}

const sendNotification = async (registrationToken, title, message) => {
  const messageSend = {
    token: registrationToken,
    notification: {
      title: title,
      body: message,
    },
    data: {
      key1: "",
      key2: "",
    },
    android: {
      priority: "high",
    },
    apns: {
      payload: {
        aps: {},
      },
    },
  };

  try {
    const response = await admin.messaging().send(messageSend);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

module.exports = { sendNotification };
