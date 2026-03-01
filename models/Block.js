const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlockSchema = new Schema(
  {
    blocker: {
      type: Schema.Types.ObjectId,
      require,
    },

    blocked: {
      type: Schema.Types.ObjectId,
      require,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);
module.exports = mongoose.model("Block", BlockSchema);
