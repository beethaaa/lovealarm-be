const { sendNotification } = require("../firebase/config");
const { ensureDbReady, mapDbError } = require("../helpers/dbError");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const registerMessageHandlers = (io, socket, onlineUsers) => {
  const getParticipantList = async (conversationId) => {
    const participants = await Conversation.findById(conversationId)
      .select("participants")
      .lean();

    return participants?.participants.map((item) => String(item)) || [];
  };

  socket.on(
    "message:send",
    async ({ content, type, conversationId, registrationToken }, callback) => {
      try {
        if (!conversationId) {
          return callback?.({
            success: false,
            message: "conversationId is required to send a message",
          });
        }
        if (!ensureDbReady(callback)) return;

        const participants = await getParticipantList(conversationId);
        if (
          !participants ||
          !Array.isArray(participants) ||
          participants.length < 2
        ) {
          return callback?.({
            success: false,
            message: "Invalid participants list",
          });
        }

        if (!participants.includes(socket.userId)) {
          return callback?.({
            success: false,
            message: "You are not a participant in this conversation",
          });
        }

        const receiverId = participants.find((i) => i !== socket.userId);

        if (!receiverId) {
          return callback?.({
            success: false,
            message: "Receiver not found",
          });
        }
        const receiverIdString = receiverId.toString();

        const newMessage = new Message({
          conversationId,
          senderId: socket.userId,
          content,
          type,
        });

        socket.to(receiverId).emit("message:new", newMessage);

        if (!onlineUsers[receiverIdString]) {
          const userName =
            await User.findById(receiverId).select("profile.name");
          // sendNotification(conversationId, userName, content )
        }
        await newMessage.save();
        return callback?.({ success: true, message: newMessage });
      } catch (error) {
        const e = mapDbError(error);
        return callback?.({ success: false, ...e });
      }
    },
  );

  socket.on("message:seen", async ({ messageId, conversationId }, callback) => {
    try {
      const conversationId = socket.data.conversationId;

      if (!conversationId) {
        return callback?.({
          success: false,
          message: "Require conversationId",
        });
      }

      const updated = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $set: { [`lastSeen.${socket.userId}`]: messageId },
        },
        { new: true },
      );
      return callback?.({ success: true, message: "Seen", updated: updated });
    } catch (error) {
      const e = mapDbError(error);
      return callback?.({ success: false, ...e });
    }
  });
};

module.exports = registerMessageHandlers;
