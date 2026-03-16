const { allowedStatus } = require("../constraints/conversationStatus");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Conversation = require("../models/Conversation");

const getConversation = async (req, res) => {
  try {
    const userId = req.userId;
    // Check if userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const conversationList = await Conversation.find({
      participants: { $in: [userId] },
    });

    if (!conversationList || conversationList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No conversations found",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Retrieve conversation successfully",
      data: conversationList,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const getConversationById = async (req, res) => {
  try {
    const userId = req.userId;
    const conversationId = req.params.conversationId;
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.participants.some((id) => id.equals(userId))) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation found",
      data: conversation,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const createConversation = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const { participants } = req.body;
    // Check if participants exists and is an array
    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({
        success: false,
        message: "Participants must be an array",
      });
    }

    // Check if participants array has exactly 2 elements
    if (participants.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Participants array must contain exactly 2 elements",
      });
    }

    // Check if current user is one of the participants
    if (!participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You must be one of the participants",
      });
    }

    // Check if both participants are different
    if (participants[0] === participants[1]) {
      return res.status(400).json({
        success: false,
        message: "Participants must be different users",
      });
    }
    console.log("ControllerParticipants: ", participants);
    
    // Check if conversation already exists between these participants
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
    });
    console.log("Existing Conversation: ", existingConversation);
    
    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        data: existingConversation,
      });
    }

    // Create new conversation
    const newConversation = await Conversation.create({
      participants,
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: newConversation,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updateConversationType = async (conversationId, type) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  if (!type) {
    throw new Error("Conversation type is required");
  }

  if (!allowedStatus(type)) {
    throw new Error("Invalid conversation type");
  }

  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    { $set: { type } },
    { new: true, runValidators: true },
  );
  return updatedConversation;
};

const updateLastSeen = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId, messageId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!conversationId || !messageId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and Message ID are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.participants.some((id) => id.equals(userId))) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    conversation.lastSeen.set(userId, messageId);
    await conversation.save();

    return res
      .status(200)
      .json({ success: true, message: `message: ${messageId} seen` });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const endConversation = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    // Check if conversationId exists
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
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
    if (!conversation.participants.some((id) => id.equals(userId))) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this conversation",
      });
    }

    // Check if conversation is already ended
    if (conversation.endedAt) {
      return res.status(400).json({
        success: false,
        message: "Conversation is already ended",
      });
    }

    // End the conversation
    const endedAt = new Date();
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $set: { endedAt } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Conversation ended successfully",
      data: updatedConversation,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
module.exports = {
  getConversation,
  createConversation,
  updateConversationType,
  updateLastSeen,
  endConversation,
  getConversationById
};
