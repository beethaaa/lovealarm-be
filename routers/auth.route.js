const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleSignup,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const { checkRequiredFields } = require("../middlewares");
const verifyJwt = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/logout").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout from the application'
  handleLogout,
);

router.route("/change-pass").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Change password (require login)'
  verifyJwt,
  checkRequiredFields("oldPassword", "newPassword"),
  changePassword,
);

router.use(checkRequiredFields("email", "password"));
router.route("/login").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login to the application'
  handleLogin,
);
router.route("/register").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  handleSignup,
);

router.route("/reset-password").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Reset password after verifying OTP'
  resetPassword,
);

module.exports = router;
