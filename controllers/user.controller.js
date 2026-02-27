const { getRoleNameByKey } = require("../constraints/role");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

/**************************
 * Return an object in format:
 *  updateData: {
 *    profile.name:"John Doe",
 *    profile.age: 20,
 *    profile.interest: ["Swimming", "Basketball"]
 * }
 *
 * this will ensure the code to not delete unmentioned field when using findByIdAndUpdate()
 *
 ****************************/
const buildUpdateObject = (updateDetail, notAllowedField) => {
  const updateData = {};

  for (const key in updateDetail) {
    if (notAllowedField.includes(key))
      return { error: `Field ${key} is not allowed to update!` };
    const value = updateDetail[key];
    if (Array.isArray(value)) {
      updateData[key] = value;
    } else if (typeof value === "object" && value !== null) {
      for (const nestedKey in value) {
        // if (notAllowedField[key].includes(nestedKey))
        updateData[`${key}.${nestedKey}`] = value[nestedKey];
      }
    } else {
      updateData[key] = value;
    }
  }

  return updateData;
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v").lean();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const addUserByAdmin = async (req, res) => {
  if (!req.body?.email || !req.body?.password || !req.body?.roleKey) {
    return res.status(403).json({
      success: false,
      message: "Email, password and roleKey are required!",
    });
  }

  const { email, password, roleKey } = req.body;

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: "Email has existed!",
    });
  }

  try {
    const hashPass = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashPass,
      roleKey,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${email} as ${getRoleNameByKey(roleKey)}`,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params?.id;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid user ID format: ${id}`,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Not found user with id ${id}!`,
      });
    }
    await User.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: `Delete user ${user.email} successfully!`,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

/*dedicated function for updating User profile*/
const updateUserProfile = async (req, res) => {
  const notAllowedField = ["role", "mode", "vip", "password"];

  try {
    const userId = req.userId;
    const updateDetail = req.body;
    const updateData = buildUpdateObject(updateDetail, notAllowedField);
    if (updateData.error)
      return res
        .status(403)
        .json({ success: false, message: updateData.error });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { runValidators: true, new: true },
    );
    console.log(`Updated User: ${updatedUser}`);
    res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updatePassword = async (req, res) => {
  const userId = req?.userId;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(403).json({
      success: false,
      message: "Old password and new password are required!",
    });
  }

  if (oldPassword === newPassword) {
    return res.status(403).json({
      success: false,
      message: "New password must be different from old password!",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Not found user with id ${userId}!`,
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ success: false, message: "Old password is incorrect!" });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updateRole = async (req, res) => {
  try {
    const userId = req?.userId;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { roleKey: role.key },
      },
      { new: true },
    );
    console.log(`Update role: ${user}`);
    res.status(200).json({
      success: true,
      message: "User role updated successfully!",
      updatedUser: user,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const updateVip = async (req, res) => {
  try {
    const userId = req?.userId;
    const { vip } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { vip } },
      { new: true },
    );
    console.log(`Update vip: ${user}`);
    res.status(200).json({
      success: true,
      message: "User VIP status updated successfully!",
      updatedVip: vip,
      updatedUser: user,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  addUserByAdmin,
  updateUserProfile,
  updatePassword,
  updateRole,
  updateVip,
};
