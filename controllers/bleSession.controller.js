const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const BleSession = require("../models/BleSession");

const createBleSession = async (req, res) => {
  try {
    const { bleUuid, platform } = req.body;

    await BleSession.create({ bleUuid, platform, userId: req.userId });

    res.sendStatus(201);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  createBleSession,
};
