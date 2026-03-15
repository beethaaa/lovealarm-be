const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Match = require("../models/Match");
const MatchStatus = require("../constraints/matchStatus");

const getAllFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const matched = await Match.find({
      users: userId,
      matchStatus: {
        $nin: [MatchStatus.PENDING, MatchStatus.ENDED, MatchStatus.BLOCKED],
      },
    }).populate({
      path: "users",
      select: "profile",
    });

    const friends = matched.map((item) => {
      const other = item.users.find((user) => user._id.toString() !== userId);

      return {
        matchId: item._id,
        friendId: other._id,
        ...other.profile,
        startedAt: item.startedAt,
        matchStatus: item.matchStatus,
      };
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
