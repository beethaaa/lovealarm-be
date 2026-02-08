const mongoose = require("mongoose");
const { ROLE } = require("../constraints/role");
const { GENDER } = require("../constraints/gender");
const { MODE } = require("../constraints/mode");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      require,
      unique: true,
    },
    password: {
      type: String,
      require,
    },
    roleKey: {
      type: Number,
      default: ROLE.USER.key,
    },
    avatarUrl: {
      type: String,
      default:
        "https://i.pinimg.com/474x/52/17/11/5217111bf01e03621b31bfd2abbdbb6a.jpg?nii=t",
    },

    profile: {
      gender: { type: Number, default: GENDER.MALE },
      birthday: { type: Date },
      interest: { type: [String], default: [] },
      personalityTags: { type: [String], default: [] },
    },

    setting: {
      bleScanEnabled: {
        type: Boolean,
        default: false,
      },
      vibrationEnabled: {
        type: Boolean,
        default: false,
      },
      companionModeEnabled: {
        type: Boolean,
        default: false,
      },
    },

    mode: { type: Number, default: MODE.SINGLE.key },

    vip: {
      isActive: {
        type: Boolean,
        default: false,
      },
      expiredAt: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
