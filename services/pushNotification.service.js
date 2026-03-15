const User = require("../models/User");
const { sendMulticastNotification } = require("../firebase/config");
const presence = require("./presence.service");

// returns: Promise<{sent:number, failed:number, skipped?:boolean, reason?:string}>
const pushToUser = async (userId, { title, body, data = {} }) => {
  const user = await User.findById(userId).select("devices").lean();
  if (!user?.devices?.length) {
    return { sent: 0, failed: 0, skipped: true, reason: "no devices" };
  }

  // one device online per user
  const online = presence.getOnlineUser(userId); // { socketId, deviceId } | undefined
  const onlineDeviceId = online?.deviceId ? String(online.deviceId) : null;

  // send to all registered tokens EXCEPT the currently online device
  const tokens = [
    ...new Set(
      user.devices
        .filter((d) => d.fcmToken)
        .filter((d) => !onlineDeviceId || String(d.deviceId) !== onlineDeviceId)
        .map((d) => d.fcmToken),
    ),
  ];

  if (!tokens.length) {
    return {
      sent: 0,
      failed: 0,
      skipped: true,
      reason: "only online device exists",
    };
  }

  const result = await sendMulticastNotification(tokens, title, body, data);

  // cleanup bad tokens
  const invalidTokens = [];
  result.responses.forEach((r, idx) => {
    if (!r.success) {
      const code = r.error?.code || "";
      if (
        code.includes("registration-token-not-registered") ||
        code.includes("invalid-registration-token")
      ) {
        invalidTokens.push(tokens[idx]);
      }
    }
  });

  if (invalidTokens.length) {
    await User.updateOne(
      { _id: userId },
      { $pull: { devices: { fcmToken: { $in: invalidTokens } } } },
    );
  }

  return { sent: result.successCount, failed: result.failureCount };
};

module.exports = { pushToUser };
