const express = require("express");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  getLoveRequest,
  createLoveRequest,
} = require("../../controllers/loveRequest.controller");
const { create } = require("../../models/LoveRequest");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Love Request']
    // #swagger.summary = 'Get love requests received by the authenticated user'
    // #swagger.security = [{ "bearerAuth": [] }]
    // verifyRoles(ROLE.USER),
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
    // verifyRoles(ROLE.USER),
    createLoveRequest,
  );
//   .put(verifyRoles(ROLE.USER));

module.exports = router;
