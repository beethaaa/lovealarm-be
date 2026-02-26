const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  getLoveRequest,
  createLoveRequest,
  editLoveRequest,
  responseToLoveRequest,
} = require("../../controllers/loveRequest.controller");
const { create } = require("../../models/LoveRequest");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Love Request']
    // #swagger.summary = 'Get love requests received by the authenticated user'
    // #swagger.security = [{ "bearerAuth": [] }]
    verifyRoles(ROLE.USER),
    getLoveRequest,
  )
  .post(
    // #swagger.tags = ['Love Request']
    // #swagger.summary = 'Create a new love request to another user'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              toUserId: {
                type: 'string',
                example: '60d0fe4f5311236168a109ca'
              }
            }
          }
        }
      }
    } */
    verifyRoles(ROLE.USER),
    createLoveRequest,
  )
  .put(
    // #swagger.tags = ['Love Request']
    // #swagger.summary = 'Update the status of a love request'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              loveRequestId: {
                type: 'string',
                example: '699da49ae5596118b557aad6'
              },
              status: {
                type: 'string',
                description: 'Possible values: PENDING, WAITING_START, WAITING_REPLY',
                enum: ['PENDING', 'WAITING_START', 'WAITING_REPLY'],
                example: 'PENDING'
              }
            }
          }
        }
      }
    } */
    verifyRoles(ROLE.USER),
    editLoveRequest,
  );
router.route("/accept").put(
  // #swagger.tags = ['Love Request']
  // #swagger.summary = 'Response to a love request'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
    required: true,
    content: {  
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            loveRequestId: {
              type: 'string',
              example: '699da49ae5596118b557aad6'
            },
            isAccepted: {
              type: 'boolean',
              example: true
            }
          }
        }
      }
    }
  } */
  verifyRoles(ROLE.USER),
  responseToLoveRequest,
);
module.exports = router;
