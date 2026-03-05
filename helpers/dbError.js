const { default: mongoose } = require("mongoose");

const mapDbError = (error) => {
  const msg = error?.message || "Server error";
  if (msg.includes("buffering timed out")) {
    return { code: "DB_TIMEOUT", message: "Database timeout. Please try again." };
  }
  return { code: "SERVER_ERROR", message: msg };
};

const ensureDbReady = (callback) => {
  if (mongoose.connection.readyState !== 1) {
    callback?.({
      success: false,
      code: "DB_NOT_CONNECTED",
      message: "Database is not connected yet.",
    });
    return false;
  }
  return true;
};

module.exports={mapDbError, ensureDbReady}