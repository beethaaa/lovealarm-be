const mongoose = require("mongoose");

const { ensureDbReady, mapDbError } = require("../helpers/dbError");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const registerMessageHandlers = (io, socket) => {
  socket.on("conversation:join", async (conversationId, callback) => {
    try {
      if (!conversationId) {
        return callback({
          success: false,
          message: "conversationId is required",
        });
      }
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.userId,
        endedAt: { $eq: null },
      });
      console.log("Conversation: ", conversation);
      
      if (!conversation) {
        return callback({ success: false, message: "Conversation not found" });
      }

      socket.join(conversationId);
      return callback({ success: true, message: "Joined conversation" }); // important
    } catch (error) {
      console.error("Error in join_conversation:", error);
      return callback({ success: false, message: "Server error" });
    }
  });

  socket.on(
    "message:send",
    async ({ content, type, conversationId }, callback) => {
      try {
        if (!conversationId) {
          return callback?.({
            success: false,
            message: "conversationId is required. Join conversation first.",
          });
        }
        if (!ensureDbReady(callback)) return;

        const newMessage = await Message.create({
          conversationId,
          senderId: socket.userId,
          content,
          type,
        });

        socket.to(conversationId).emit("message:new", newMessage);
        return callback({ success: true, message: "Message sent" });
      } catch (error) {
        const e = mapDbError(error);
        return callback?.({ success: false, ...e });
      }
    },
  );

  socket.on("conversation:leave", (conversationId, callback) => {
    socket.leave(conversationId);
    return callback({ success: true, message: "Left conversation" });
  });

  socket.on("message:seen", async ({ messageId, conversationId }, callback) => {
    try {
      // const conversationId = socket.data.conversationId;

      if (!conversationId) {
        return callback?.({
          success: false,
          message: "Join conversation first",
        });
      }

      const updated = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: { [`lastSeen.${socket.userId}`]: messageId },
        },
        { new: true },
      );
      return callback({ success: true, message: "Seen", updated: updated 1});
    } catch (error) {
      const e = mapDbError(error);
      return callback?.({ success: false, ...e });
    }
  });
};

module.exports = registerMessageHandlers;
