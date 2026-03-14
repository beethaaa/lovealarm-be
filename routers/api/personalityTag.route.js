const express = require("express");
const router = express.Router();
const { ROLE } = require("../../constraints/role");
const {
  getAllPersonalityTags,
  createPersonalityTag,
  updatePersonalityTag,
  deletePersonalityTag,
} = require("../../controllers/personalityTag.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");

router.get(
  "/",
  // #swagger.tags = ['Personality Tags']
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.summary = 'Get all personality tags'
  getAllPersonalityTags,
);

router.post(
  "/",
  // #swagger.tags = ['Personality Tags']
  // #swagger.summary = 'Create a new personality tag (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
          'application/json': {
              schema: {
                  type: 'object',
                  properties: {
                      tag: {
                          type: 'string',
                          example: 'Enthusiastic'
                      }
                  },
                  required: ['tag']
              }
          }
      }
  } */
  verifyRoles(ROLE.ADMIN),
  createPersonalityTag,
);

router.put(
  "/",
  // #swagger.tags = ['Personality Tags']
  // #swagger.summary = 'Update an existing personality tag (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
          'application/json': {
              schema: {
                  type: 'object',
                  properties: {
                      id: {
                          type: 'string',
                          example: '60d0fe4f5311236168a109ca'
                      },
                      tag: {
                          type: 'string',
                          example: 'Outgoing'
                      }
                  },
                  required: ['id', 'tag']
              }
          }
      }
  } */
  verifyRoles(ROLE.ADMIN),
  updatePersonalityTag,
);

router.delete(
  "/",
  // #swagger.tags = ['Personality Tags']
  // #swagger.summary = 'Delete a personality tag (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
          'application/json': {
              schema: {
                  type: 'object',
                  properties: {
                      id: {
                          type: 'string',
                          example: '60d0fe4f5311236168a109ca'
                      }
                  },
                  required: ['id']
              }
          }
      }
  } */
  verifyRoles(ROLE.ADMIN),
  deletePersonalityTag,
);

module.exports = router;
