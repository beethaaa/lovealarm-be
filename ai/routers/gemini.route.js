const express = require("express");

const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { getConversationStart } = require("../controllers/gemini.controller");
const { checkRequiredFields } = require("../../middlewares");
const router = express.Router();

router.route("/conversation-start").post(
  // #swagger.tags = ['Gemini AI']
  // #swagger.summary = 'Get conversation start'
  // #swagger.security = [{ "bearerAuth": [] }]
  checkRequiredFields("interests"),
  verifyRoles(ROLE.USER),
  getConversationStart,
);

module.exports = router;
