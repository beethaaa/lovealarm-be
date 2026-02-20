const MatchStatus = require("../constraints/matchStatus");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Couple = require("../models/Couple");
const Match = require("../models/Match");

const couples = {};

const acceptCoupleMode = async (req, res) => {
  try {
    const userId = req.userId;
    const { toUserId } = req.body;

    if (toUserId === userId)
      return res
        .status(400)
        .json({ message: "You cannot couple with yourself!" });

    const dupplicate = await Couple.findOne({ users: userId });
    if (dupplicate)
      return res.status(400).json({ message: "You are in couple with other!" });

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

    delete couples[toUserId];

    res.status(200).json({ message: "Welcome to Couple Mode!" });
  } catch (error) {
    serverErrorMessageRes(req, error);
  }
};

module.exports = { acceptCoupleMode };
