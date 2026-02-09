const { getRoleNameByKey } = require("../constraints/role");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occured!" });
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
    console.error(error);
    res.sendStatus(500);
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
    console.error(error);
    res.status(500).json({ message: "Unexpected error occured!" });
  }
};

module.exports = { getAllUsers, deleteUser, addUserByAdmin };
