const express = require("express");
const {
  addInterest,
  getAllInterest,
  deleteInterest,
} = require("../../controllers/interest.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const { checkRequiredFields } = require("../../middlewares");
const {
  addFixAnniversary,
  getAllFixAnniversary,
  deleteFixAnniversary,
  updateFixAnniversary,
} = require("../../controllers/fixAnniversary.controller");

const router = express.Router();

router.post(
  "/",
  // #swagger.tags = ['Fix Anniversary']
  // #swagger.summary = 'Add a new fix anniversary'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: '1_DAY'
              },
              days: {
                type: 'number',
                example: 1
              },
              months: {
                type: 'number',
                example: 0
              },
              years: {
                type: 'number',
                example: 0
              },
              after: {
                type: 'string',
                example: '64f1a2b3c4d5e6f7a8b9c0d1'
              }
            }
          }
        }
      }
    } */
  verifyRoles(ROLE.ADMIN),
  checkRequiredFields("code", "days", "months", "years"),
  addFixAnniversary,
);
router.get(
  "/",
  // #swagger.tags = ['Fix Anniversary']
  // #swagger.summary = 'Get all fix anniversaries'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  getAllFixAnniversary,
);
router.delete(
  "/:id",
  // #swagger.tags = ['Fix Anniversary']
  // #swagger.summary = 'Delete fix anniversaries'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  deleteFixAnniversary,
);
router.put(
  "/:id",
  // #swagger.tags = ['Fix Anniversary']
  // #swagger.summary = 'Update fix anniversaries'
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
                example: '64f1a2b3c4d5e6f7a8b9c0d1'
              },
              code: {
                type: 'string',
                example: '1_DAY'
              },
              days: {
                type: 'number',
                example: 1
              },
              months: {
                type: 'number',
                example: 0
              },
              years: {
                type: 'number',
                example: 0
              },
              after: {
                type: 'string',
                example: '64f1a2b3c4d5e6f7a8b9c0d1'
              }
            }
          }
        }
      }
    } */
  verifyRoles(ROLE.ADMIN),
  updateFixAnniversary,
);

module.exports = router;
