const { getRoleNameByKey } = require("../constraints/role");
const { buildUpdateObject } = require("../helpers/buildUpdateObject");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");



const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      recordPerPage = 10,
      active,
      keyword,
      roleKey,
    } = req.query;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1); //rewind to page 1 if invalid number provided
    const perPage = Math.max(parseInt(recordPerPage, 10) || 10, 1); //rewind to 10 records per page if invalid number provided
    const skip = (pageNumber - 1) * perPage;
    const filter = {};

    if (keyword) {
      filter["profile.name"] = { $regex: keyword, $options: "i" };
    }
    const activeStr = String(active).toLowerCase();
    if (activeStr === "true") {
      filter["active"] = true;
    } else if (activeStr === "false") {
      filter["active"] = false;
    }
    const roleKeysArray = Array.isArray(roleKey) ? roleKey : [roleKey];
    const parsedRoleKeys = roleKeysArray
      .map((rk) => {
        const trimmed = typeof rk === "string" ? rk.trim() : "";
        const parsed = parseInt(trimmed, 10);
        return Number.isNaN(parsed) ? null : parsed;
      })
      .filter((rk) => rk !== null);

    if (parsedRoleKeys.length > 0) {
      filter["roleKey"] = { $in: parsedRoleKeys };
    }

    filter["_id"] = { $ne: req.userId };

    // get total record and total page
    const totalRecords = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / perPage);

    //get user based on page
    const users = await User.find(filter)
      .select("-password -__v")
      .skip(skip)
      .limit(perPage)
      .lean();
    res.status(200).json({
      success: true,
      pageItemCount: users.length,
      totalRecords,
      totalPages,
      currentPage: pageNumber,
      data: users,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const getCurrentlyLoggedInUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unexpected error, no ID retrieved from current user",
      });
    }
    const currentUser = await User.findById(userId)
      .select("-password -__v")
      .lean();
    return res.status(200).json({
      success: true,
      data: currentUser,
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

    let duplicate = null;
    if (updateDetail.email) {
      duplicate = await User.findOne({
        email: updateDetail.email,
        _id: { $ne: userId },
      }).lean();
    }

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use!",
      });
    }

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
    const userId = req?.params?.id;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: { roleKey: role.key },
      },
      { new: true },
    ).select("-password -__v").lean();
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
    ).select("-password -__v").lean();
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
  getUsers,
  deleteUser,
  addUserByAdmin,
  updateUserProfile,
  updatePassword,
  updateRole,
  updateVip,
  getCurrentlyLoggedInUser,
};
