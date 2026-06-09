const express = require("express");

const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
// const { getConversationStart } = require("../controllers/gemini.controller");
const { checkRequiredFields } = require("../../middlewares");
const {
  getConversationStart,
  recommendGift,
  recommendEntertainmentAddress,
} = require("../controllers/openai");
const router = express.Router();

router.route("/conversation-start").post(
  // #swagger.tags = ['Gemini AI']
  // #swagger.summary = 'Get conversation start'
  // #swagger.security = [{ "bearerAuth": [] }]
  checkRequiredFields("interests"),
  verifyRoles(ROLE.USER),
  getConversationStart,
);

router.route("/recommend-gift").post(
  // #swagger.tags = ['Gemini AI']
  // #swagger.summary = 'Recommend gift'
  // #swagger.security = [{ "bearerAuth": [] }]
  checkRequiredFields("interests", "event", "budget", "gender", "age"),
  verifyRoles(ROLE.USER),
  recommendGift,
);

router.route("/recommend-entertainment-address").post(
  // #swagger.tags = ['Gemini AI']
  // #swagger.summary = 'Recommend entertainment address'
  // #swagger.security = [{ "bearerAuth": [] }]
  checkRequiredFields(
    "interests",
    "event",
    "budget",
    "gender",
    "age",
    "address",
  ),
  verifyRoles(ROLE.USER),
  recommendEntertainmentAddress,
);

module.exports = router;
