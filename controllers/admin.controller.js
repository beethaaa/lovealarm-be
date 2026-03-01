const { getModeNameByKey } = require("../constraints/mode");
const { getRoleNameByKey } = require("../constraints/role");
const { buildUpdateObject } = require("../helpers/buildUpdateObject");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const User = require("../models/User");

const updateUserByAdmin = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const updateDetail = req.body;
    const adminAllowedField = ["roleKey", "vip", "mode", "setting"]; // only password maybe?
    /**************VALIDATION************** */
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User id is required!" });

    if (userId === req.userId && updateDetail.roleKey) // allow admin to update their own profile but not roleKey  
      return res.status(400).json({
        success: false,
        message: "You cannot update your own profile!",
      });
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    // Validate roleKey if provided
    if (updateDetail?.roleKey) {
      try {
        getRoleNameByKey(updateDetail.roleKey); // This will throw if invalid
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    if (updateDetail?.mode) {
      try {
        getModeNameByKey(updateDetail.mode); // This will throw if invalid
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    }
    // Reuse buildUpdateObject with different restrictions
    const updateData = buildUpdateObject(updateDetail, adminAllowedField);
    if (updateData.error)
      return res
        .status(403)
        .json({ success: false, message: updateData.error });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { runValidators: true, new: true },
    );
    console.log(`Updated Succesfully: ${updatedUser}`);
    res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = { updateUserByAdmin };
