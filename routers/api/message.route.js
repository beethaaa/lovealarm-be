const express = require("express");
const { editMessage } = require("../../controllers/message.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();

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
                        conversationId: {
                            type: 'string',
                            example: '699da49ae5596118b557aad6'
                        },
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
