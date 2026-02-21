const { getRoleNameByKey } = require("../constraints/role");
const { serverErrorMessageRes } = require("../helpers/serverErrorMessage");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const addUserByAdmin = async (req, res) => {
  if (!req.body?.email || !req.body?.password || !req.body?.roleKey) {
    return res.status(403).json({
      message: "Email, password and roleKey are required!",
    });
  }

  const { email, password, roleKey } = req.body;

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Email has existed!" });
  }

  try {
    const hashPass = await bcrypt.hash(password, 10);

    await User.create({
      email,

      password: hashPass,
      roleKey,
    });

    return res.status(201).json({
      message: `Welcome ${email} as ${getRoleNameByKey(roleKey)}`,
    });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params?.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: `Not found user with id ${id}!` });
    }
    await User.deleteOne({ _id: id });
    res
      .status(200)
      .json({ message: `Delete user ${user.email} successfully!` });
  } catch (error) {
    serverErrorMessageRes(res, error);
  }
};
/*dedicated function for updating User profile*/
const updateUserProfile = async (req,res) =>{
  try{
    const userId = req?.userId;
    const updateDetail = req.body;
    if(updateDetail.roleKey || updateDetail.mode || updateDetail.vip)
      return res.status(403).json({message: `secured field detected(role, mode, vip) is prohibited when updating profile`})

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateDetail,
      { runValidators: true}
    )
    console.log(`Updated User: ${updatedUser}`);
    res.status(200).json({message: "User profile updated successfully!", updatedUser})
  }catch(error){
    serverErrorMessageRes(req,res)
  }
}

const updatePassword = async (req,res)=>{
  const userId = req?.userId;
  const {oldPassword, newPassword} = req.body;
  if(!oldPassword || !newPassword){
    return res.status(403).json({message: "Old password and new password are required!"})
  }

  if(oldPassword === newPassword){
    return res.status(403).json({message: "New password must be different from old password!"})
  }

  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: `Not found user with id ${userId}!`})
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      return res.status(403).json({message: "Old password is incorrect!"})
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    
    
  }



}

module.exports = { getAllUsers, deleteUser, addUserByAdmin, updateUserProfile };


