const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { MODE } = require("../constraints/mode.js");

const ChallengeSchema = new Schema(
  {
    mode: {
      type: Number,
      default: MODE.SINGLE.key,
    },
    title: {
      type: String,
      require,
    },
    rewardPoint: {
      type: Number,
      require,
    },
    location: {
      lat: { type: Number, require },
      lng: { type: Number, require },
      radiusMeters: { type: Number, require },
      name: {
        type: String,
        require,
      },
      imageUrl: {
        type: String,
      },
    },
    expiredAt: {
      type: Date,
      require,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
