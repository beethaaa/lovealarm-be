const Interest = require("../models/Interest");
const PersonalityTag = require("../models/PersonalityTag");

const cache = {
  interests: [],
  personalityTags: [],
};

const updateAllInterests = async () => {
  try {
    cache.interests = await Interest.find().lean();
  } catch (error) {
    throw new Error(error);
  }
};

const updateAllPersonalityTags = async () => {
  try {
    cache.personalityTags = await PersonalityTag.find().lean();
  } catch (error) {
    throw new Error(error);
  }
};

const initCache = async () => {
  await updateAllInterests();
  await updateAllPersonalityTags();
};

module.exports = {
  cache,
  initCache,
  updateAllInterests,
  updateAllPersonalityTags,
};
