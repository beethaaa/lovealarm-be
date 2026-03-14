const mongoose = require("mongoose");
const { initCache } = require("../cache");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Database connected!!!");

    await initCache();
    console.log("Init cache successfully!");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
