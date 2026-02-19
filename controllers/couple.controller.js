const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Couple = require("../models/Couple");

const couple = {};

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

    
  } catch (error) {
    serverErrorMessageRes(req, error);
  }
};

module.exports = { acceptCoupleMode };
