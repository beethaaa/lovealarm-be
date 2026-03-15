const User = require("../models/User");

const getMyDevices = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("devices");

    return res.status(200).json({
      success: true,
      devices: user.devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const registerDevice = async (req, res) => {
  try {
    const { deviceId, fcmToken, platform } = req.body;

    if (!deviceId || !fcmToken || !platform) {
      return res.status(400).json({
        success: false,
        message: "deviceId, fcmToken, and platform are required",
      });
    }

    if (!["android", "ios"].includes(platform)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform. Must be android or ios",
      });
    }

    const user = await User.findById(req.userId);

    // Check if device already exists
    const existingDeviceIndex = user.devices.findIndex(
      (d) => d.deviceId === deviceId,
    );

    if (existingDeviceIndex !== -1) {
      // Update existing device
      user.devices[existingDeviceIndex].fcmToken = fcmToken;
      user.devices[existingDeviceIndex].platform = platform;
      user.devices[existingDeviceIndex].lastActive = new Date();
    } else {
      // Add new device
      user.devices.push({
        deviceId,
        fcmToken,
        platform,
        lastActive: new Date(),
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Device registered successfully",
      devices: user.devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeDevice = async (req, res) =>{
    try {
    const { deviceId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { devices: { deviceId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Device removed successfully",
      devices: user.devices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = { getMyDevices, registerDevice, removeDevice }