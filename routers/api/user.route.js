const express = require("express");
const {
  deleteUser,
  addUserByAdmin,
  updateVip,
  updateRole,
  updatePassword,
  updateUserProfile,
  getUsers,
  getCurrentlyLoggedInUser,
} = require("../../controllers/user.controller");
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const router = express.Router();

router
  .route("/")
  .get(
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get all users with pagination and filters'
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.parameters['page'] = {
      in: 'query',
      description: 'Page number (default: 1)',
      type: 'integer',
      example: 1
    } */
    /* #swagger.parameters['recordPerPage'] = {
      in: 'query',
      description: 'Records per page (default: 10)',
      type: 'integer',
      example: 10
    } */
    /* #swagger.parameters['keyword'] = {
      in: 'query',
      description: 'Search by user name',
      type: 'string',
      example: 'John'
    } */
    /* #swagger.parameters['active'] = {
      in: 'query',
      description: 'Filter by active status',
      type: 'boolean',
      example: true
    } */
    /* #swagger.parameters['roleKey'] = {
      in: 'query',
      description: 'Filter by role keys (array)',
      type: 'array',
      example: ['1', '2']
    } */
    /* #swagger.responses[200] = {
      description: "List of users with pagination",
      schema: {
        success: true,
        count: 10,
        totalRecords: 21,
        totalPages: 3,
        currentPage: 1,
        data: [{
          _id: "507f1f77bcf86cd799439011",
          email: "user@example.com",
          roleKey: 1,
          avatarUrl: "https://example.com/avatar.jpg",
          active: true,
          profile: {
            name: "John Doe",
            gender: "male",
            birthday: "1990-01-15",
            interest: ["music", "travel"], 
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
        }]
      }
    } */
    verifyRoles(ROLE.ADMIN),
    getUsers,
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

router.route("/me").get(
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get currently logged in user profile'
  // #swagger.security = [{ "bearerAuth": [] }]
  getCurrentlyLoggedInUser,
)

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
