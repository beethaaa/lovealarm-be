const express = require("express");

const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { checkRequiredFields } = require("../../middlewares");
const {
  createBleSession,
  getAllCurrentBleSession,
} = require("../../controllers/bleSession.controller");
const router = express.Router();

router
  .route("/")
  .post(
    // #swagger.tags = ['BleSession']
    // #swagger.summary = 'Create a new ble session (User only)'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    checkRequiredFields("bleUuid", "platform"),
    createBleSession,
  )
  .get(
    // #swagger.tags = ['BleSession']
    // #swagger.summary = 'get all current ble session'
    // #swagger.security = [{ "bearerAuth": [] }]
    getAllCurrentBleSession,
  );

module.exports = router;
