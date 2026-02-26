const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const BleSession = require("../models/BleSession");

const createBleSession = async (req, res) => {
  try {
    const { bleUuid, platform } = req.body;
    const userId = req.userId;

    await BleSession.deleteMany({ userId });

    await BleSession.create({ bleUuid, platform, userId });

    res.sendStatus(201);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  createBleSession,
};
