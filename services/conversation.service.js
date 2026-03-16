const Conversation = require("../models/Conversation");

const createConversation = async (userId, loveRequest) => {
  const participants = [
    loveRequest.fromUserId.toString(),
    loveRequest.toUserId.toString(),
  ];

  if (!userId) {
    throw { status: 400, message: "User ID is required" };
  }

  if (!participants || !Array.isArray(participants)) {
    throw { status: 400, message: "Participants must be an array" };
  }

  if (participants.length !== 2) {
    throw {
      status: 400,
      message: "Participants array must contain exactly 2 elements",
    };
  }

  if (!participants.includes(userId)) {
    throw { status: 403, message: "You must be one of the participants" };
  }

  if (participants[0] === participants[1]) {
    throw { status: 400, message: "Participants must be different users" };
  }

  const existingConversation = await Conversation.findOne({
    participants: { $all: participants },
  });

  if (existingConversation) {
    return existingConversation;
  }

  const newConversation = await Conversation.create({
    participants,
  });

  return newConversation;
};

module.exports = { createConversation };
