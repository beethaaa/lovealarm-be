const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FixAnniversarySchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  months: {
    type: Number,
    required: true,
  },
  years: {
    type: Number,
    required: true,
  },
  after: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FixAnniversary",
  },
});

module.exports = mongoose.model("FixAnniversary", FixAnniversarySchema);
