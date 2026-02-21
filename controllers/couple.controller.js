const { default: mongoose } = require("mongoose");
const MatchStatus = require("../constraints/matchStatus");
const { MODE } = require("../constraints/mode");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Couple = require("../models/Couple");
const Match = require("../models/Match");
const User = require("../models/User");

const couples = {};

const acceptCoupleMode = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.userId;
    const { toUserId } = req.body;

    if (toUserId === userId)
      return res
        .status(400)
        .json({ message: "You cannot couple with yourself!" });

    await session.withTransaction(async () => {
      const dupplicate = await Couple.findOne({ users: userId });
      if (dupplicate)
        return res
          .status(400)
          .json({ message: "You are in couple with other!" });

      const coupleInMatches = await Match.findOne({ users: userId });
      if (!coupleInMatches)
        return res
          .status(400)
          .json({ message: "You have not sent a love request yet!" });

      if (coupleInMatches.matchStatus !== MatchStatus.MATCHED)
        return res
          .status(400)
          .json({ message: "Your love request has not been accepted yet!" });

      if (!couples[toUserId]) {
        couples[userId] = toUserId;
        return res
          .status(200)
          .json({ message: "Wait for your partner accepting..." });
      }

      await Couple.create({
        users: [userId, toUserId],
      });
      await Match.updateOne(
        { users: { $all: [(userId, toUserId)] } },
        {
          $set: {
            matchStatus: MatchStatus.COUPLED,
          },
        },
      );
      await User.updateMany(
        { _id: { $in: currentCouple.users } },
        {
          $set: {
            mode: MODE.COUPLE,
          },
        },
      );

      delete couples[toUserId];
    });

    res.status(200).json({ message: "Welcome to Couple Mode!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
const leaveCoupleMode = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.userId;

    await session.withTransaction(async () => {
      const currentCouple = await Couple.findOne({ users: userId });
      if (!currentCouple)
        return res
          .status(400)
          .json({ message: "You are not in couple mode with anyone!" });

      const coupleInMatches = await Match.findOne({
        users: { $all: currentCouple.users },
      });
      if (!coupleInMatches)
        return res.status(409).json({
          message: "Cannot find couple in Match table! Contact admin for help!",
        });

      if (coupleInMatches.matchStatus !== MatchStatus.COUPLED)
        return res.status(400).json({ message: "You are not in couple mode!" });

      await Couple.deleteOne({ _id: currentCouple._id });

      await Match.updateOne(
        { users: { $all: currentCouple.users } },
        {
          $set: {
            matchStatus: MatchStatus.ENDED,
          },
        },
      );

      await User.updateMany(
        { _id: { $in: currentCouple.users } },
        {
          $set: {
            mode: MODE.COUPLE,
          },
        },
      );
    });

    res.status(200).json({ message: "Welcome to Single Mode!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = { acceptCoupleMode, leaveCoupleMode };
