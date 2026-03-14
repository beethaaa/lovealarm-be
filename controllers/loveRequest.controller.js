const mongoose = require("mongoose");

const {
  LoveRequestStatus,
  isValidLoveRequestStatus,
} = require("../constraints/loveRequestStatus");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const LoveRequest = require("../models/LoveRequest");
const { getIo } = require("../socket/socket");
const Conversation = require("../models/Conversation");
const Friend = require("../models/Friend");

const io = getIo();

const createFriendRecord = async (ownerId, friendId) => {
  try {
    if (!ownerId || !friendId)
      throw new Error("Owner ID and Friend ID are required");

    const newFriend = await Friend.create({
      ownerId,
      friendId,
    });
    return newFriend;
  } catch (error) {
    return error;
  }
};

const getLoveRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const loveRequest = await LoveRequest.find({ toUserId: userId });
    return res.status(200).json({
      success: true,
      message: "Love requests retrieved successfully!",
      count: loveRequest.length,
      data: loveRequest,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const createLoveRequest = async (req, res) => {
  try {
    const fromUserId = req.userId;
    const { toUserId } = req.body;

    if (!toUserId)
      return res
        .status(400)
        .json({ success: false, message: "toUserId is required!" });

    if (fromUserId === toUserId)
      return res.status(400).json({
        success: false,
        message: "You cannot send a love request to yourself!",
      });
    const duplicatedLoveRequest = await LoveRequest.findOne({
      fromUserId: fromUserId,
      toUserId: toUserId,
    });
    if (duplicatedLoveRequest)
      return res.status(400).json({
        success: false,
        message: "You have already sent a love request to this user!",
      });

    const createdLoveRequest = await LoveRequest.create({
      fromUserId: fromUserId,
      toUserId: toUserId,
    });

    io.to(toUserId).emit("love-request:send", {
      fromUserId: fromUserId,
      message: "Someone is having a crush on you!",
      loveRequestId: createdLoveRequest._id,
    });

    return res.status(201).json({
      success: true,
      message: "Love request created successfully!",
      data: createdLoveRequest,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updateStatus = async (loveRequestId, status) => {
  if (!loveRequestId)
    return res
      .status(400)
      .json({ success: false, message: "loveRequestId is required!" });

  const updatedLoveRequest = await LoveRequest.findByIdAndUpdate(
    loveRequestId,
    { status: status },
    { new: true },
  );

  return updatedLoveRequest;
};

const editLoveRequest = async (req, res) => {
  try {
    const { loveRequestId, status } = req.body;
    const userId = req.userId;

    if (!loveRequestId)
      return res
        .status(400)
        .json({ success: false, message: "loveRequestId is required!" });

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "status is required!" });
    const existedLoveRequest = await LoveRequest.findById(loveRequestId);
    if (!existedLoveRequest)
      return res
        .status(404)
        .json({ success: false, message: "Love request not found!" });
    if (
      existedLoveRequest.toUserId.toString() !== userId &&
      existedLoveRequest.fromUserId.toString() !== userId
    )
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this love request!",
      });
    if (!isValidLoveRequestStatus(status))
      return res.status(400).json({
        success: false,
        message: `Invalid love request status! Must be one of: ${Object.values(LoveRequestStatus).join(", ")}`,
      });
    const updatedLoveRequest = await updateStatus(loveRequestId, status);
    return res.status(200).json({
      success: true,
      message: "Love request updated successfully!",
      data: updatedLoveRequest,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const acceptLoveRequest = async (loveRequestId) => {
  try {
    const updatedLoveRequest = await updateStatus(
      loveRequestId,
      LoveRequestStatus.WAITING_START,
    );
    return res.status(200).json({
      success: true,
      message: "Love request accepted successfully!",
      data: updatedLoveRequest,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteLoveRequest = async (loveRequestId) => {
  try {
    const deleted = await LoveRequest.deleteOne({ _id: loveRequestId });
    if (deleted.deletedCount === 0) {
      return {
        success: false,
        message: "Love request not found!",
      };
    }
    return {
      success: true,
      message: "Love request deleted successfully!",
    };
  } catch (error) {
    return error;
  }
};

const createConversation = async (userId, loveRequest) => {
  try {
    const participants = [
      loveRequest.fromUserId.toString(),
      loveRequest.toUserId.toString(),
    ];

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!participants || !Array.isArray(participants)) {
      throw new Error("Participants must be an array");
    }

    if (participants.length !== 2) {
      throw new Error("Participants array must contain exactly 2 elements");
    }

    if (!participants.includes(userId)) {
      const error = new Error("You must be one of the participants");
      error.statusCode = 403;
      throw error;
    }

    if (participants[0] === participants[1]) {
      throw new Error("Participants must be different users");
    }

    const existingConversation = await Conversation.findOne({
      participant: { $all: participants },
    });

    if (existingConversation) {
      const error = new Error(
        "Conversation already exists between these users",
      );
      error.statusCode = 409;
      error.existingConversation = existingConversation;
      throw error;
    }

    const newConversation = await Conversation.create({
      participants,
    });

    return newConversation;
  } catch (error) {
    return error;
  }
};

const responseToLoveRequest = async (req, res) => {
  try {
    const { isAccepted, loveRequestId } = req.body;
    const userId = req.userId;
    // Validate required fields before proceeding with business logic
    if (
      loveRequestId === undefined ||
      loveRequestId === null ||
      loveRequestId === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "loveRequestId is required!",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(loveRequestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loveRequestId format!",
      });
    }
    if (typeof isAccepted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAccepted must be a boolean value!",
      });
    }
    const existedLoveRequest = await LoveRequest.findById(loveRequestId);
    console.log(existedLoveRequest);

    if (!existedLoveRequest)
      return res
        .status(404)
        .json({ success: false, message: "Love request not found!" });
    if (existedLoveRequest.toUserId.toString() !== userId)
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this love request!",
      });
    if (existedLoveRequest.status !== LoveRequestStatus.PENDING)
      return res.status(400).json({
        success: false,
        message: "Love request is not in pending status!",
      });

    switch (isAccepted) {
      case true: {
        const newConversation = await createConversation(
          userId,
          existedLoveRequest,
        );
        if (newConversation && !(newConversation instanceof Error)) {
          const newFriendRecord = await createFriendRecord(
            userId,
            existedLoveRequest.fromUserId,
          );
          if (newFriendRecord instanceof Error) {
            return res.status(500).json({
              success: false,
              message: "Error occurred while creating friend record!",
            });
          }
          const deleteRequest = await deleteLoveRequest(loveRequestId);
          return res.status(201).json({
            success: true,
            message:
              "Love request accepted and conversation created successfully!",
            conversation: newConversation,
            deletedLoveRequest: deleteRequest,
          });
        }
      }
      case false:
        return await deleteLoveRequest(loveRequestId);
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid isAccepted value!",
        });
    }
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getLoveRequest,
  createLoveRequest,
  editLoveRequest,
  responseToLoveRequest,
};
