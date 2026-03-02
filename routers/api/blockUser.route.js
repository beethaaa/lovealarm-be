const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  createBlockLink,
  deleteBlockLinks,
  getBlockedList,
} = require("../../controllers/block.controller");

router
  .route("/")
  .get(
    // #swagger.tags = ['Block']
    // #swagger.summary = 'Get block list of the user'
    // #swagger.security = [{ "bearerAuth": [] }]

    verifyRoles(ROLE.USER),
    getBlockedList,
  )
  .post(
    // #swagger.tags = ['Block']
    // #swagger.summary = 'Block a user'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      description: 'User ID to block',
        required: true,
        content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                  blockedId: {
                    type: 'string',
                    example: '699da39ee5596118b557aad2'
                    }
                  },
                  
                }
            }
        }
  } */
    verifyRoles(ROLE.USER),
    createBlockLink,
  );

router.route("/:id").delete(
  // #swagger.tags = ['Block']
  // #swagger.summary = 'Unblock a user'
  // #swagger.security = [{ "bearerAuth": [] }]
  
  verifyRoles(ROLE.USER),
  deleteBlockLinks,
);

module.exports = router;
