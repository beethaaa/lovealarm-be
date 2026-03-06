const mongoose = require("mongoose");
const {CONVERSATION_STATUS} = require("../constraints/conversationStatus");
const { Schema } = mongoose;
const ConversationSchema = Schema(
  {
    type: {
      type: Number,
      default: CONVERSATION_STATUS.TEMP,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: "Participant array must contain 2 elements",
      },
    },
    lastSeen: {
      type: Map,
      of: {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
      default:{}
    },
    isArchived: {
      type: Boolean,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", ConversationSchema);
