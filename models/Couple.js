const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoupleSchema = new Schema(
  {
    users: [mongoose.Types.ObjectId],
    startedAt: {
      //user can update this field instead of createdAt (timestamp)
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Couple", CoupleSchema);
