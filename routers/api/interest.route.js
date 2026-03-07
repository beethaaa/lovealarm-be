const express = require("express");
const {
  addInterest,
  getAllInterest,
  deleteInterest,
} = require("../../controllers/interest.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { checkRequiredFields } = require("../../middlewares");

const router = express.Router();

router.post(
  "/",
  // #swagger.tags = ['Interest']
  // #swagger.summary = 'Add a new interest'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              interest: {
                type: 'string',
                example: 'Gaming'
              }
            }
          }
        }
      }
    } */
  verifyRoles(ROLE.ADMIN),
  checkRequiredFields("interest"),
  addInterest,
);
router.get(
  "/",
  // #swagger.tags = ['Interest']
  // #swagger.summary = 'Get all interests'
  // #swagger.security = [{ "bearerAuth": [] }]
  getAllInterest,
);
router.delete(
  "/",
  // #swagger.tags = ['Interest']
  // #swagger.summary = 'Delete interests'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              interestIds: {
                type: 'array',
                items: {
                  type: 'string',
                  example: '64f1a2b3c4d5e6f7a8b9c0d1'
                }
              }
            }
          }
        }
      }
    } */
  verifyRoles(ROLE.ADMIN),
  checkRequiredFields("interestIds"),
  deleteInterest,
);

module.exports = router;
