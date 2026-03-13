var admin = require("firebase-admin");

var serviceAccount = require("../love-alarm-c4454-firebase-adminsdk-fbsvc-c8880010f8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNoftification = async (registrationToken, message) =>{
  const messageSend = {
    token: registrationToken,
    notification: {
      title:"",
      body:"",
    },
    data:{
      key1:"",
      key2:"",
    },
    android:{
      priority: "high"
    },
    apns:{
      payload: {
        aps: {
          
        }
      }
    }
  }
}