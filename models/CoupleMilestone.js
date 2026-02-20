const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CoupleMilestoneSchema = new Schema(
  {
    coupleId: mongoose.Types.ObjectId,
    code: String,
    date: Date,
    createdBy: mongoose.Types.ObjectId,
  },
  { timestamps: true },
);

module.exports = mongoose.model("CoupleMilestone", CoupleMilestoneSchema);
