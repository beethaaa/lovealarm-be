const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { acceptCoupleMode } = require("../../controllers/couple.controller");
const { checkRequiredFields } = require("../../middlewares");
const router = express.Router();

router.route("/accept").post(
  // #swagger.tags = ['Couple']
  // #swagger.summary = 'Accept Couple mode'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  checkRequiredFields("toUserId"),
  acceptCoupleMode,
);

module.exports = router;
