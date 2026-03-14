const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonalityTagSchema = new Schema({
  tag: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PersonalityTag", PersonalityTagSchema);
