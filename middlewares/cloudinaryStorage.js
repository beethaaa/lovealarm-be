const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary/config");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lovealarm/avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
