const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { createConversation, getConversation, updateLastSeen, endConversation } = require("../../controllers/conversation.controller");
const router = express.Router();

router.route("/")
.get(
    // #swagger.tags = ['Conversation']
    // #swagger.summary = 'Get conversation by conversation ID'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    getConversation
)
.post(
    // #swagger.tags = ['Conversation']
    // #swagger.summary = 'Create a new conversation'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        participants: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            example: ['699da49ae5596118b557aad6', '699da49ae5596118b557aad7']
                        },

                    }
                }
            }
        }
    } */
    verifyRoles(ROLE.USER),
    createConversation
)

router.route("/seen").put(
    // #swagger.tags = ['Conversation']
    // #swagger.summary = 'Update last seen time of a conversation'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                conversationId: {
                    type: 'string',
                    example: '699da49ae5596118b557aad6'
                },
                messageId: {
                    type: 'string',
                    example: '699da49ae5596118b557aad6'
                }
            }
          }
        }
      }
    } */
    verifyRoles(ROLE.USER),
    updateLastSeen
)
router.route("/end").put(
    // #swagger.tags = ['Conversation']
    // #swagger.summary = 'End a conversation'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        conversationId: {
                            type: 'string',
                            example: '699da49ae5596118b557aad6'
                        }
                    }
                }
            }
        }
    } */
    verifyRoles(ROLE.USER),
    endConversation
)


module.exports = router;

