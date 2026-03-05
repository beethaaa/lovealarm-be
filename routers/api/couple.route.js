const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  acceptCoupleMode,
  leaveCoupleMode,
  getPartnerInfo,
} = require("../../controllers/couple.controller");
const { checkRequiredFields } = require("../../middlewares");
const router = express.Router();

router.route("/").get(
  // #swagger.tags = ['Couple']
  // #swagger.summary = 'Get info of partner if you are in Couple mode'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  getPartnerInfo,
);

router.route("/accept").post(
  // #swagger.tags = ['Couple']
  // #swagger.summary = 'Accept Couple mode'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  checkRequiredFields("toUserId"),
  acceptCoupleMode,
);

router.route("/leave").post(
  // #swagger.tags = ['Couple']
  // #swagger.summary = 'Leave Couple mode'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  leaveCoupleMode,
);

module.exports = router;
