const express = require('express');
const router = express.Router();
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { createBlockLink, deleteBlockLinks } = require('../../controllers/block.controller');

router.route("/").post(
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
                    required: ['blockedId']
                }
            }
        }
  } */
    verifyRoles(ROLE.USER),
    createBlockLink
).delete(
    // #swagger.tags = ['Block']
    // #swagger.summary = 'Unblock a user'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      description: 'User ID to unblock',
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
                    required: ['blockedId']
                }
            }
        }
  } */

        verifyRoles(ROLE.USER),
        deleteBlockLinks
)

module.exports = router;