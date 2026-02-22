const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  getSuggestFriendList,
} = require("../../controllers/suggestFriend.controller");
const { checkRequiredFields } = require("../../middlewares");
const router = express.Router();

router.route("/").post(
  // #swagger.tags = ['Suggest Friends']
  // #swagger.summary = 'Get a list of nearby friends based on array of nearby bleUuid'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  checkRequiredFields("bleUuids"),
  getSuggestFriendList,
);

module.exports = router;
