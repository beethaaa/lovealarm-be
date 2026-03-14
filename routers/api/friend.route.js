const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
// const { checkRequiredFields } = require("../../middlewares");
const { getAllFriends } = require("../../controllers/friend.controller");

const router = express.Router();

router.get("/", verifyRoles([ROLE.USER]), getAllFriends);

module.exports = router;
