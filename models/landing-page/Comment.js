const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    comment: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);
module.exports = mongoose.model("Comment", CommentSchema);
