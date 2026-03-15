const Friend = require("../models/Friend");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Match = require("../models/Match");

const getAllFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const friends = await Match.find().populate({
      path: "users",
      select: "profile",
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
