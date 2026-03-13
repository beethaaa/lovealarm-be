const FixAnniversary = require("../models/FixAnniversary");

const addFixAnniversary = async (req, res) => {
  try {
    const { code, days, months, years } = req.body;
    let after = undefined;
    if (req.body?.after) {
      after = req.body.after;
    }
    const fixAnniversary = await FixAnniversary.create({
      code: code.toUpperCase(),
      days,
      months,
      years,
      after,
    });
    res.status(200).json(fixAnniversary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFixAnniversary = async (req, res) => {
  try {
    const { id } = req.params;
    const fixAnniversary = await FixAnniversary.findByIdAndDelete(id);
    res.status(200).json(fixAnniversary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateFixAnniversary = async (req, res) => {
  try {
    const { id } = req.params;
    const fixAnniversary = await FixAnniversary.findByIdAndUpdate(id, req.body);
    res.status(200).json(fixAnniversary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFixAnniversary = async (req, res) => {
  try {
    const fixAnniversaries = await FixAnniversary.find();
    res.status(200).json(fixAnniversaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFixAnniversary,
  deleteFixAnniversary,
  updateFixAnniversary,
  getAllFixAnniversary,
};
