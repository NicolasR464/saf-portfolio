const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const homeSchema = new Schema({
  image: { type: String },
});

module.exports = mongoose.model("HomeImg", homeSchema);
