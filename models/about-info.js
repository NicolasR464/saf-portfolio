const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const aboutInfo = new Schema({
  bio: {
    type: String,
    required: true,
  },
  image: { type: String },
});

module.exports = mongoose.model("AboutInfo", aboutInfo);
