const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestSchema = new Schema({
  interest: {
    type: String,
    require,
  },
});

module.exports = mongoose.model("Interest", InterestSchema);
