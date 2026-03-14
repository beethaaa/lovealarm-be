const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  createConversation,
  getConversation,
  updateLastSeen,
  endConversation,
  getConversationById,
} = require("../../controllers/conversation.controller");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Conversation']
    // #swagger.summary = 'Get all user's conversation'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.responses[200] = {
         description: 'Conversation list found',
         content: {
            'application/json': {
                example: {
                    "success": true,
                    "message": "Retrieve conversation successfully",
                    "data": [
                        {
                            "_id": "69b4df15dafde5d61328abf7",
                            "type": 1,
                            "participants": [
                                "69b4c2ab96c2b385a0328575",
                                "69b4c2b496c2b385a0328578"
                            ],
                            "lastSeen": {},
                            "endedAt": null,
                            "createdAt": "2026-03-14T04:07:49.467Z",
                            "updatedAt": "2026-03-14T04:07:49.467Z",
                            "__v": 0
                        },
                        {
                            
                            "_id": "70b4df15dafde5d61328ade7",
                            "type": 1,
                            "participants": [
                                "69b4c2ab96c2b385a0328575",
                                "69b4c2b496c2b385a0328578"
                            ],
                            "lastSeen": {},
                            "endedAt": null,
                            "createdAt": "2026-03-10T04:02:48.4Z",
                            "updatedAt": "2026-03-11T04:03:49.32Z",
                            "__v": 0
                        
                        },
                        
                    ]
                }
            }
         }
    } */
    verifyRoles(ROLE.USER),
    getConversation,
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
    createConversation,
  );
router.route("/:conversationId").get(
  // #swagger.tags = ['Conversation']
  // #swagger.summary = 'Get a conversation by its ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['conversationId'] = {
                in: 'path',
                description: 'Conversation ID',
                required: true,
                type: 'string',
                example: '69b4df15dafde5d61328abf7'
        } */
  /* #swagger.responses[200] = {
         description: 'Conversation found',
         content: {
            'application/json': {
                example: {
                    "success": true,
                    "message": "Conversation found",
                    "data": {
                        "_id": "69b4df15dafde5d61328abf7",
                        "type": 1,
                        "participants": [
                            "69b4c2ab96c2b385a0328575",
                            "69b4c2b496c2b385a0328578"
                        ],
                        "lastSeen": {},
                        "endedAt": null,
                        "createdAt": "2026-03-14T04:07:49.467Z",
                        "updatedAt": "2026-03-14T04:07:49.467Z",
                        "__v": 0
                    }
                }
            }
         }
    } */
  verifyRoles(ROLE.USER),
  getConversationById,
);

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
  updateLastSeen,
);
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
  endConversation,
);

module.exports = router;
