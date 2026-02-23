// const express = require("express");
// const {
//   getAllUsers,
//   updateUserProfile,
//   deleteUser,
//   updateVip,
//   updateRole,
//   updatePassword,
//   addUserByAdmin,
// } = require("../controllers/user.controller");
// const router = express.Router();

// router.route(`/user`).get(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Get all users (admin only)'
//   getAllUsers,
// );

// router.route("/user").post(
//   // #swagger.tags = ['User']
//   // #swagger.summary = 'Add a new user by admin (admin only)'
//   addUserByAdmin,
// );

// router.route("/user").put(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Update user profile'
//   updateUserProfile,
// );

// router.route("/user/password").put(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Update user password'
//   updatePassword,
// );

// router.route("/user/role").put(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Update user role (admin only)'
//   updateRole,
// );
// router.route("/user/vip").put(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Update user VIP status (admin only)'
//   updateVip,
// );
// router.route("/user/:id").delete(
//   //#swagger.tags = ['User']
//   //#swagger.summary = 'Delete a user (admin only)'
//   deleteUser,
// );
