const express = require("express");
const router = express.Router();
const verifyRoles = require("../../middlewares/roleMiddleware");
const { ROLE } = require("../../constraints/role");
const {
  getMyDevices,
  registerDevice,
  removeDevice,
} = require("../../controllers/device.controller");

router.route("/my-devices").get(
  // #swagger.tags = ['Device']
  // #swagger.summary = 'Get all devices of authenticated user'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = {
        description: 'Device list retrieved successfully',
        content: {
            'application/json': {
                example: {
                    success: true,
                    devices: [
                        {
                            deviceId: 'device-123',
                            fcmToken: 'fcm-token-abc',
                            platform: 'android',
                            lastActive: '2026-03-15T10:30:00.000Z'
                        }
                    ]
                }
            }
        }
    } */
  verifyRoles(ROLE.USER),
  getMyDevices,
);

router.route("/register").post(
  // #swagger.tags = ['Device']
  // #swagger.summary = 'Register or update a device for authenticated user'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    required: ['deviceId', 'fcmToken', 'platform'],
                    properties: {
                        deviceId: {
                            type: 'string',
                            example: 'device-123'
                        },
                        fcmToken: {
                            type: 'string',
                            example: 'fcm-token-abc'
                        },
                        platform: {
                            type: 'string',
                            enum: ['android', 'ios'],
                            example: 'android'
                        }
                    }
                }
            }
        }
    } */
  /* #swagger.responses[200] = {
        description: 'Device registered successfully',
        content: {
            'application/json': {
                example: {
                    success: true,
                    message: 'Device registered successfully',
                    devices: [
                        {
                            deviceId: 'device-123',
                            fcmToken: 'fcm-token-abc',
                            platform: 'android',
                            lastActive: '2026-03-15T10:30:00.000Z'
                        }
                    ]
                }
            }
        }
    } */
  /* #swagger.responses[400] = {
        description: 'Invalid request body',
        content: {
            'application/json': {
                example: {
                    success: false,
                    message: 'deviceId, fcmToken, and platform are required'
                }
            }
        }
    } */
  verifyRoles(ROLE.USER),
  registerDevice,
);

router.route("/remove/:deviceId").delete(
  // #swagger.tags = ['Device']
  // #swagger.summary = 'Remove a device of authenticated user'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['deviceId'] = {
        in: 'path',
        description: 'Device ID to remove',
        required: true,
        type: 'string',
        example: 'device-123'
    } */
  /* #swagger.responses[200] = {
        description: 'Device removed successfully',
        content: {
            'application/json': {
                example: {
                    success: true,
                    message: 'Device removed successfully',
                    devices: []
                }
            }
        }
    } */
  verifyRoles(ROLE.USER),
  removeDevice,
);

module.exports = router;
