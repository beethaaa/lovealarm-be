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
const {
  editStatus,
  getMatchByUser,
  handleCreateMatchForLoveRequest,
} = require("../services/match.service");
const { createFriendRecord } = require("../services/friend.service");
const MatchStatus = require("../constraints/matchStatus");
const { createConversation } = require("../services/conversation.service");

const io = getIo();

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
    const newMatch = await handleCreateMatchForLoveRequest(fromUserId, toUserId);

    io.to(toUserId).emit("love-request:send", {
      fromUserId: fromUserId,
      message: "Someone is having a crush on you!",
      loveRequestId: createdLoveRequest._id,
    });

    return res.status(201).json({
      success: true,
      message: "Love request created successfully!",
      loveRequest: createdLoveRequest,
      match: newMatch,
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



const responseToLoveRequest = async (req, res) => {
  try {
    const { isAccepted, loveRequestId } = req.body;
    const userId = req.userId;

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
        try {
          const newConversation = await createConversation(
            userId,
            existedLoveRequest,
          );

          // const newFriendRecord = await createFriendRecord(
          //   userId,
          //   existedLoveRequest.fromUserId,
          // );

          const getMatch = await getMatchByUser(
            userId,
            existedLoveRequest.fromUserId,
          );

          if (!getMatch) {
            return res.status(404).json({
              success: false,
              message: "Match not found!",
            });
          }

          const editedMatch = await editStatus(
            getMatch._id,
            MatchStatus.MATCHED,
          );

          const deleteRequest = await deleteLoveRequest(loveRequestId);

          return res.status(201).json({
            success: true,
            message:
              "Love request accepted and conversation created successfully!",
            conversation: newConversation,
            deletedLoveRequest: deleteRequest,
            // friend: newFriendRecord,
            editedMatch: editedMatch,
          });
        } catch (innerError) {
          throw innerError;
        }
      }

      case false: {
        try {
          const deleted = await deleteLoveRequest(loveRequestId);

          const getMatch = await getMatchByUser(
            userId,
            existedLoveRequest.fromUserId,
          );

          if (!getMatch) {
            return res.status(404).json({
              success: false,
              message: "Match not found!",
            });
          }

          const editedMatch = await editStatus(
            getMatch._id,
            MatchStatus.ENDED,
          );
          return res.status(200).json({
            success: true,
            message: "Love request rejected and match status updated!",
            deletedLoveRequest: deleted,
            editedMatch: editedMatch,
          });
        } catch (innerError) {
          throw innerError;
        }
      }

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid isAccepted value!",
        });
    }
  } catch (error) {
    if (error.status) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getLoveRequest,
  createLoveRequest,
  editLoveRequest,
  responseToLoveRequest,
};
