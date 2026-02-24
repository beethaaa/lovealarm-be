const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const BleSession = require("../models/BleSession");
const User = require("../models/User");

const getSuggestFriendList = async (req, res) => {
  try {
    const { bleUuids } = req.body;
    if (bleUuids?.length <= 0)
      return res
        .status(200)
        .json({ message: "No one is available near you now!" });

    const sessions = await BleSession.find({ bleUuid: { $in: bleUuids } });

    if (sessions?.length <= 0)
      return res
        .status(200)
        .json({ message: "No one is available near you now!" });

    const users = await User.find({
      _id: { $in: sessions.map((item) => item.userId) },
    });

    if (users?.length <= 0)
      return res
        .status(200)
        .json({ message: "No one is available near you now!" });

    res.status(200).json({
      total: users.length,
      users: users.map((item) => ({
        userId: item._id,
        bleSessionUuid: item.bleUuid,
        avatarUrl: item.avatarUrl,
        gender: item.profile?.gender,
      })),
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = { getSuggestFriendList };
