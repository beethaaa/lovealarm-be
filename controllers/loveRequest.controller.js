const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const LoveRequest = require("../models/LoveRequest");

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
    const createdLoveRequest = await LoveRequest.create({
      fromUserId: fromUserId,
      toUserId: toUserId,
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

const editLoveRequest = async (req, res) => {};

module.exports = { getLoveRequest, createLoveRequest };
