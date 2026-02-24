const express = require("express");
const {
  getAllUsers,
  deleteUser,
  addUserByAdmin,
  updateVip,
  updateRole,
  updatePassword,
  updateUserProfile,
} = require("../../controllers/user.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get all users'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.responses[200] = {
       description: "List of users",
       schema: [{
          email: "user@example.com",
          roleKey: 1,
          avatarUrl: "https://example.com/avatar.jpg",

          profile: {
              name: "John Doe",
              gender: "male",
              birthday: "1990-01-15",
              interests: ["music", "travel"],
              personalityTags: ["outgoing", "creative"]
            },

          setting: {
              bleScanEnabled: true,
              vibrationEnabled: false,
              companionModeEnabled: true
            },

          mode: "SINGLE",

          vip: {
              isActive: false,
              expiredAt: "2025-12-31T23:59:59Z"
          }
        },'...']
    } */
    verifyRoles(ROLE.ADMIN),
    getAllUsers,
  )
  .post(
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Create a new user (Admin only)'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
                  email: {
                    type: 'string',
                    example: 'aa@gmail.com'
                  },
                  password: {
                    type: 'string',
                    example: '123'
                  },
                  roleKey:{
                    type:'number',
                    example:'2'
                  
                }
              }
            },
          }
        }
      }
    } */
    verifyRoles(ROLE.ADMIN),
    addUserByAdmin,
  )
  .put(
    //#swagger.tags = ['Users']
    //#swagger.summary = 'Update user profile'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                example: 'abc@email.com'
              },
              avatarUrl: {
                type: 'string',
                example: 'https://example.com/avatar.jpg'
              },
              profile: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'John Doe'
                  },
                  gender: {
                    type: 'number',
                    example: 1
                  },
                  birthday: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-12-31T23:59:59Z'
                  },
                  interest: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['music', 'travel']
                  },
                  personalityTags: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    example: ['outgoing', 'creative']
                  }
                }
              }
            },
          }
        }
      }
    } */
    updateUserProfile,
  );

router.route("/password").put(
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Update user password'
  // #swagger.security = [{ "bearerAuth": [] }]
  updatePassword,
);

router.route("/role").put(
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Update user role (admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              role: {
                type: 'object',
                properties: {
                  key: {
                    type: 'number',
                    example: 1
                  },
                  name: {
                    type: 'String',
                    example: "Admin"
                  }
                },
                required: ['key']
              }
            },
            required: ['role']
          }
        }
      }
  } */
  /* #swagger.responses[200] = {
      description: "Role updated successfully",
      schema: { message: "User role updated successfully!" }
  } */
  updateRole,
);
router.route("/vip").put(
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Update user VIP status'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              isActive: {
                type: 'boolean',
                example: true
              },
              expiredAt: {
                type: 'string',
                example: '2025-12-31T23:59:59Z'
              }
            },
            required: ['isActive', 'expiredAt']
          }
        }
      }
  } */
  /* #swagger.responses[200] = {
      description: "VIP status updated",
      schema: { message: "User VIP status updated successfully!" }
  } */
  updateVip,
);
router.route("/:id").delete(
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete a user by ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  verifyRoles(ROLE.ADMIN),
  deleteUser,
);
module.exports = router;
