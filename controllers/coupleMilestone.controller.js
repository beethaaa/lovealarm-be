const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const Couple = require("../models/Couple");
const CoupleMilestone = require("../models/CoupleMilestone");

const createNewMilestone = async (req, res) => {
  try {
    const { userId } = req;
    const couple = await Couple.findOne({ users: userId });
    if (!couple)
      return res.status(400).json({ message: "You are not in Couple mode!" });

    const { code, date } = req.body;

    await CoupleMilestone.create({
      coupleId: couple._id,
      code,
      date,
      createdBy: userId,
    });

    res
      .status(201)
      .json({ message: `${code} milestone is created successfully!` });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
const getAllMilestones = async (req, res) => {
  try {
    const { userId } = req;
    const couple = await Couple.findOne({ users: userId });
    if (!couple)
      return res.status(400).json({ message: "You are not in Couple mode!" });

    const milestones = await CoupleMilestone.find({ coupleId: couple._id });

    res.status(200).json(milestones);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
const updateMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { userId } = req;

    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID" });
    }

    const couple = await Couple.findOne({ users: userId });
    if (!couple)
      return res.status(400).json({ message: "You are not in Couple mode!" });

    const milestone = await CoupleMilestone.findOne({
      _id: milestoneId,
      coupleId: couple._id,
    });

    if (!milestone)
      return res.status(404).json({ message: "Cannot find this milestone!" });

    const allowedFields = ["code", "date"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await CoupleMilestone.updateOne(
      { _id: milestoneId },
      { $set: updateData },
      { runValidators: true },
    );

    res.status(200).json({ message: "Update successfully!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
const deleteMilestone = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { userId } = req;

    if (!mongoose.Types.ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid milestone ID" });
    }

    const couple = await Couple.findOne({ users: userId });
    if (!couple)
      return res.status(400).json({ message: "You are not in Couple mode!" });

    const milestone = await CoupleMilestone.findOne({
      _id: milestoneId,
      coupleId: couple._id,
    });

    if (!milestone)
      return res.status(404).json({ message: "Cannot find this milestone!" });

    await CoupleMilestone.deleteOne({ _id: milestoneId });

    res.status(200).json({ message: "Delete successfully!" });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  createNewMilestone,
  getAllMilestones,
  updateMilestone,
  deleteMilestone,
};
