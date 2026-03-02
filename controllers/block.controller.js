const { default: mongoose } = require("mongoose");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Block = require("../models/Block");
const User = require("../models/User");

const checkBlocked = async (userId1, userId2) => {
  const block = await Block.find({
    $or: [
      { blocker: userId1, blocked: userId2 },
      { blocker: userId2, blocked: userId1 },
    ],
  });

  if (block.length === 0)
    return 0; // no blocked between userId1 and userId2
  else if (block.length === 1) {
    return block[0].blocker.toString() === userId1 ? 1 : 2; // 1: userId1 blocked userId2, 2: userId2 blocked userId1
  } else return 3; // multually blocked
};

const getBlockedList = async (req, res) => {
  try {
    const userId = req.userId;
    const blockedList = await Block.find({ blocker: userId }).populate(
      "blocked",
      "-password -__v",
    );
    res.status(200).json({
      success: true,
      message: "Blocked users retrieved successfully",
      data: blockedList,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const createBlockLink = async (req, res) => {
  try {
    const userId = req.userId;
    const { blockedId } = req.body;

    // 1. Check if blockedId is provided
    if (!blockedId) {
      return res
        .status(400)
        .json({ success: false, message: "blockedId is required" });
    }
    // 1.1 check if blockedId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(blockedId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blockedId format" });
    }
    // 2. Check if user is trying to block themselves
    if (userId === blockedId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot block yourself" });
    }

    // 3. Check if the block link already exists
    const isBlockedUserExist = await User.findById(blockedId);
    if (!isBlockedUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "User to block not found" });
    }

    const existedBlock = await Block.findOne({
      blocker: userId,
      blocked: blockedId,
    });
    if (existedBlock) {
      return res
        .status(409)
        .json({ success: false, message: "This user is already been blocked" });
    }

    const newBlock = await Block.create({
      blocker: userId,
      blocked: blockedId,
    });
    res.status(201).json({
      success: true,
      message: "User blocked successfully",
      data: newBlock,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteBlockLinks = async (req, res) => {
  try {
    const userId = req.userId;
    const blockedId = req?.params?.id;

    if (!blockedId) {
      return res
        .status(400)
        .json({ success: false, message: "blockedId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(blockedId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid blockedId format" });
    }

    const blockStatus = await checkBlocked(userId, blockedId); // Call once

    if (blockStatus === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No block link found" });
    }

    if (blockStatus === 2) {
      return res
        .status(403)
        .json({
          success: false,
          message: "This user is blocking you, but you are not blocking them",
        });
    }

    if (blockStatus === 1 || blockStatus === 3) {
      const deleted = await Block.deleteOne({
        blocker: userId,
        blocked: blockedId,
      });

      if (deleted.deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Block link not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Block link deleted successfully" });
    }
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  createBlockLink,
  deleteBlockLinks,
  checkBlocked,
  getBlockedList,
};
