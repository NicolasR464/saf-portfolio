const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const aboutInfo = new Schema({
  bio: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("AboutInfo", aboutInfo);
