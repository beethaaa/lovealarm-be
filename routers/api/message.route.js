const express = require("express");
const {
  editMessage,
  fetchMessage,
} = require("../../controllers/message.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();
router.route("/").get(
  // #swagger.tags = ['Message']
  // #swagger.summary = 'Fetch all messages'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['conversationId'] = {
        in: 'query',
        description: 'Conversation ID to fetch messages from',
        required: true,
        type: 'string',
        example: '69a8e3d5efdc9c0d269991dc'
    } */
  /* #swagger.parameters['beforeId'] = {
        in: 'query',
        description: 'Fetch messages older than this message ID (pagination cursor)',
        required: false,
        type: 'string',
        example: '699da49ae5596118b557aad0'
    } */
  /* #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Maximum number of messages to return',
        required: false,
        type: 'integer',
        default: 20,
        example: 20
    } */
  verifyRoles(ROLE.USER),
  fetchMessage,
);
router
  .route("/:messageId")
  .put(
    // #swagger.tags = ['Message']
    // #swagger.summary = 'Edit a message by message ID'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            example: 'Hello, how are you?'
                        }
                    }
                }
            }
        }
    } */
    verifyRoles(ROLE.USER),
    editMessage,
  )
  .delete(
    // #swagger.tags = ['Message']
    // #swagger.summary = 'Delete a message by message ID'
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
    editMessage,
  );

module.exports = router;
