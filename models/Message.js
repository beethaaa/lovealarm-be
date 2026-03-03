const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: String,
    type: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", MessageSchema);
