const express = require("express");
const router = express.Router();
const { updateUserByAdmin } = require("../../controllers/admin.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");

router.route("/user/:id").put(
  //#swagger.tags = ['Admin']
  //#swagger.summary = 'Update user data by admin'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              roleKey: {
                type: 'number',
                example: 2,
              },vip: {
                type: 'object',
                properties: {
                    isActive: {
                        type: 'boolean',
                        example: true,
                    },
                    expiredAt: {
                        type: 'string',
                        format: 'date-time',
                        example: "2024-12-31T23:59:59.000Z",
                    }
                },
              },
                mode: {
                    type: 'number',
                    example: 1,
                    enum: [1, 2]
                },
                setting: {
                    type: 'object',
                    properties: {
                        bleScanEnabled: {
                            type: 'boolean',
                            example: true,
                        },
                        vibrationEnabled: {
                            type: 'boolean',
                            example: true,
                        },
                        companionModeEnabled: {
                            type: 'boolean',
                            example: true,
                        }
                    }
                }
            }
          }
        }
      }
    } */
  verifyRoles(ROLE.ADMIN),
  updateUserByAdmin,
);

module.exports = router;
