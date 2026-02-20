const mongoose = require("mongoose");
const MatchStatus = require("../constraints/matchStatus");
const Schema = mongoose.Schema;

const MatchSchema = new Schema(
  {
    users: [mongoose.Types.ObjectId],
    startedAt: {
      //user can update this field instead of createdAt (timestamp)
      type: Date,
      default: Date.now,
    },
    matchStatus: {
      type: String,
      default: MatchStatus.PENDING,
    },
    blockedBy: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Match", MatchSchema);
