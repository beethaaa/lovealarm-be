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
        throw {
          status: 400,
          message: "You are in couple with other!",
        };

      const coupleInMatches = await Match.findOne({ users: userId });
      if (!coupleInMatches)
        throw {
          status: 400,
          message: "You have not sent a love request yet!",
        };

      if (coupleInMatches.matchStatus !== MatchStatus.MATCHED)
        throw {
          status: 400,
          message: "Your love request has not been accepted yet!",
        };

      if (!couples[toUserId]) {
        couples[userId] = toUserId;
        throw {
          status: 200,
          message: "Wait for your partner accepting...",
        };
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
            mode: MODE.COUPLE.key,
          },
        },
      );

      delete couples[toUserId];
    });

    res.status(200).json({ message: "Welcome to Couple Mode!" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    serverErrorMessageRes(res, error);
  } finally {
    session.endSession();
  }
};

const leaveCoupleMode = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.userId;

    await session.withTransaction(async () => {
      const currentCouple = await Couple.findOne({ users: userId }, null, {
        session,
      });

      if (!currentCouple) {
        throw {
          status: 400,
          message: "You are not in couple mode with anyone!",
        };
      }

      const coupleInMatches = await Match.findOne(
        { users: { $all: currentCouple.users } },
        null,
        { session },
      );

      if (!coupleInMatches) {
        throw {
          status: 409,
          message: "Cannot find couple in Match table! Contact admin for help!",
        };
      }

      if (coupleInMatches.matchStatus !== MatchStatus.COUPLED) {
        throw {
          status: 400,
          message: "You are not in couple mode!",
        };
      }

      await Couple.deleteOne({ _id: currentCouple._id }, { session });

      await Match.updateOne(
        { _id: coupleInMatches._id },
        { $set: { matchStatus: MatchStatus.ENDED } },
        { session },
      );

      await User.updateMany(
        { _id: { $in: currentCouple.users } },
        { $set: { mode: MODE.SINGLE.key } },
        { session },
      );
    });

    res.status(200).json({ message: "Welcome to Single Mode!" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    serverErrorMessageRes(res, error);
  } finally {
    session.endSession();
  }
};

module.exports = { acceptCoupleMode, leaveCoupleMode };
