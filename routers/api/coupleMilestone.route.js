const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { checkRequiredFields } = require("../../middlewares");
const {
  createNewMilestone,
  getAllMilestones,
  updateMilestone,
  deleteMilestone,
} = require("../../controllers/coupleMilestone.controller");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['CoupleMilestone']
    // #swagger.summary = 'Get all couple milestones'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    getAllMilestones,
  )
  .post(
    // #swagger.tags = ['CoupleMilestone']
    // #swagger.summary = 'Create new couple milestone'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    checkRequiredFields("code", "date"),
    createNewMilestone,
  );

router
  .route("/:milestoneId")
  .put(
    // #swagger.tags = ['CoupleMilestone']
    // #swagger.summary = 'Update a couple milestone'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    updateMilestone,
  )
  .delete(
    // #swagger.tags = ['CoupleMilestone']
    // #swagger.summary = 'Delete a couple milestone'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    deleteMilestone,
  );

module.exports = router;
