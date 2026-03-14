const { cache } = require("../cache");

const checkValidInterest = (interests) => {
  const cacheInterests = new Set(
    cache.interests.map((interest) => interest.interest),
  );

  const notValid = interests.filter(
    (interest) => !cacheInterests.has(interest),
  );

  if (notValid.length > 0) {
    return { isError: true, message: "Invalid interest(s) provided!" };
  }

  return { isError: false };
};

const checkValidPersonalityTags = (personalityTags) => {
  const cachePersonalityTags = new Set(
    cache.personalityTags.map((tag) => tag.tag),
  );

  const notValid = personalityTags.filter(
    (tag) => !cachePersonalityTags.has(tag),
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
