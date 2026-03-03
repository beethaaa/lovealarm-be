const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");

const createMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId, content, type } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Message type is required",
      });
    }

    // Validate message type
    if (!allowedMessageType(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message type",
      });
    }
    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Check if user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    // Check if conversation is ended
    if (conversation.endedAt) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to an ended conversation",
      });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId: userId,
      content,
      type,
    });

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not the sender of this message",
      });
    }

    if (message.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit a deleted message",
      });
    }

    message.content.set(content);
    await message.save();

    return res.status(200).json({
      success: true,
      message: "Message edited successfully",
      data: message,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not the sender of this message",
      });
    }

    message.isDeleted = true;
    await message.save();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  createMessage,
  editMessage,
  deleteMessage,
};
