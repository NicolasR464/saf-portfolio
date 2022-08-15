const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const safSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("SafInfo", safSchema);
