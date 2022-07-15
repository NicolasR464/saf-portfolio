const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const homeSchema = new Schema({
  text: {
    type: String,
  },
  image: { type: String },
});

module.exports = mongoose.model("Home", homeSchema);
