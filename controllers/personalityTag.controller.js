const PersonalityTag = require("../models/PersonalityTag");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const { cache, updateAllPersonalityTags } = require("../cache/index.js");

const getAllPersonalityTags = async (req, res) => {
  try {
    const personalityTags = cache.personalityTags;
    return res.status(200).json({
      success: true,
      data: personalityTags,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const createPersonalityTag = async (req, res) => {
  try {
    const { tag } = req.body;
    const personalityTag = await PersonalityTag.create({ tag });
    await updateAllPersonalityTags();
    return res.status(200).json({
      success: true,
      data: personalityTag,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updatePersonalityTag = async (req, res) => {
  try {
    const { id, tag } = req.body;
    const personalityTag = await PersonalityTag.findByIdAndUpdate(
      id,
      { tag },
      { new: true },
    );
    await updateAllPersonalityTags();
    return res.status(200).json({
      success: true,
      data: personalityTag,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deletePersonalityTag = async (req, res) => {
  try {
    const { id } = req.body;
    const personalityTag = await PersonalityTag.findByIdAndDelete(id);
    await updateAllPersonalityTags();
    return res.status(200).json({
      success: true,
      data: personalityTag,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getAllPersonalityTags,
  createPersonalityTag,
  updatePersonalityTag,
  deletePersonalityTag,
};
