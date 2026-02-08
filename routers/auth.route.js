const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleSignup,
} = require("../controllers/authController");
const router = express.Router();

router.route("/login").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login to the application'
  handleLogin,
);
router.route("/logout").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout from the application'
  handleLogout,
);
router.route("/register").post(
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  handleSignup,
);

module.exports = router;
