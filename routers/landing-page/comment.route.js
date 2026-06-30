const express = require("express");
const { checkRequiredFields } = require("../../middlewares");
const {
  postComment,
  getComments,
  deleteComment,
} = require("../../controllers/landing-page/comment.controller");
const verifyJwt = require("../../middlewares/authMiddleware");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();

router.route("/").post(
  // #swagger.tags = ['Comment']
  // #swagger.summary = 'Post comment'
  checkRequiredFields("comment"),
  postComment,
);
router.route("/").get(
  // #swagger.tags = ['Comment']
  // #swagger.summary = 'Get comments'
  getComments,
);
router.route("/:id").delete(
  verifyJwt,
  verifyRoles(ROLE.ADMIN),
  // #swagger.tags = ['Comment']
  // #swagger.summary = 'Delete comment'
  // #swagger.security = [{ "bearerAuth": [] }]
  deleteComment,
);

module.exports = router;
