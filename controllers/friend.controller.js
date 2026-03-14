const Friend = require("../models/Friend");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");

const getAllFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const friends = await Friend.find({ ownerId: userId }).populate({
      path: "friendId",
      select: "profile -password -__v -roleKey -active -createdAt -updatedAt",
    });
    return res.status(200).json({
      success: true,
      data: friends,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = { getAllFriends };
