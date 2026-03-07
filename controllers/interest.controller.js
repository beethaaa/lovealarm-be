const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Interest = require("../models/Interest");

const addInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    await Interest.create({ interest });
    return res.status(200).json({ message: "Interest added successfully" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const getAllInterest = async (req, res) => {
  try {
    const interests = await Interest.find();
    return res.status(200).json({ interests });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteInterest = async (req, res) => {
  try {
    const { interestIds } = req.body;
    await Interest.deleteMany({ _id: { $in: interestIds } });
    return res.status(200).json({ message: "Interest deleted successfully" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  addInterest,
  getAllInterest,
  deleteInterest,
};
