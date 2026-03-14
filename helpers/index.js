const { cache } = require("../cache");

const checkValidInterest = (interests) => {
  const interestIds = new Set(
    cache.interests.map((interest) => interest._id.toString()),
  );

  const notValid = interests.filter(
    (interest) => !interestIds.has(interest.toString()),
  );

  if (notValid.length > 0) {
    return { isError: true, message: "Invalid interest(s) provided!" };
  }

  return { isError: false };
};

const checkValidPersonalityTags = (personalityTags) => {
  const personalityTagIds = new Set(
    cache.personalityTags.map((tag) => tag._id.toString()),
  );

  const notValid = personalityTags.filter(
    (tag) => !personalityTagIds.has(tag.toString()),
  );

  if (notValid.length > 0) {
    return { isError: true, message: "Invalid personality tag(s) provided!" };
  }

  return { isError: false };
};

module.exports = {
  checkValidInterest,
  checkValidPersonalityTags,
};
