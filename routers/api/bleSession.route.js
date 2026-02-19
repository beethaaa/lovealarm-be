const express = require("express");

const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { createBleSession } = require("../../controllers/bleSessionController");
const { checkRequiredFields } = require("../../middlewares");
const router = express.Router();

router.route("/").post(
  // #swagger.tags = ['BleSession']
  // #swagger.summary = 'Create a new ble session (User only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.USER),
  checkRequiredFields("bleUuid", "platform"),
  createBleSession,
);

module.exports = router;
