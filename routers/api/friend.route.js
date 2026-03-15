const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { getAllFriends } = require("../../controllers/friend.controller");

const router = express.Router();

router.get(
  "/",
  verifyRoles(ROLE.USER),
  // #swagger.tags = ['Friends']
  // #swagger.summary = 'Get all friends'
  // #swagger.security = [{ "bearerAuth": [] }]
  getAllFriends,
);

module.exports = router;
