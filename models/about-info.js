const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const aboutInfo = new Schema({
  bio: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
});

module.exports = mongoose.model("AboutInfo", aboutInfo);
