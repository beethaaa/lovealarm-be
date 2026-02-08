const express = require("express");
const {
  getAllUsers,
  deleteUser,
  addUserByAdmin,
} = require("../../controllers/userController");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();

router
  .route("/")
  .get(verifyRoles(ROLE.ADMIN), getAllUsers)
  .post(verifyRoles(ROLE.ADMIN), addUserByAdmin);
router.route("/:id").delete(verifyRoles(ROLE.ADMIN), deleteUser);

module.exports = router;
