const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BleSession = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require,
    },
    bleUuid: {
      type: String,
      require,
    },
    platform: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // 60 giây = 1 phút
    },
  },
);

module.exports = mongoose.model("BleSession", BleSession);
