const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");

const { checkRequiredFields } = require("../../middlewares");
const {
  getAllChallenge,
  addChallenge,
  updateChallenge,
  deleteChallenge,
} = require("../../controllers/challenge.controller");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Challenge']
    // #swagger.summary = 'Get all challenge'
    // #swagger.security = [{ "bearerAuth": [] }]
    getAllChallenge,
  )
  .post(
    // #swagger.tags = ['Challenge']
    // #swagger.summary = 'Add a new challenge'
    // #swagger.security = [{ "bearerAuth": [] }]
    checkRequiredFields(
      "mode",
      "title",
      "rewardPoint",
      "location.lat",
      "location.lng",
      "location.radiusMeters",
      "location.name",
      "expiredAt",
    ),
    verifyRoles(ROLE.ADMIN),
    addChallenge,
  );

router
  .route("/:id")
  .patch(
    // #swagger.tags = ['Challenge']
    // #swagger.summary = 'Update a challenge'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.ADMIN),
    updateChallenge,
  )
  .delete(
    // #swagger.tags = ['Challenge']
    // #swagger.summary = 'Delete a challenge'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.ADMIN),
    deleteChallenge,
  );

module.exports = router;
