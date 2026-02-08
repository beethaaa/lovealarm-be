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
  .get(
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get all users'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.ADMIN),
    getAllUsers,
  )
  .post(
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Create a new user (Admin only)'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.ADMIN),
    addUserByAdmin,
  );
router.route("/:id").delete(
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete a user by ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  deleteUser,
);

module.exports = router;
