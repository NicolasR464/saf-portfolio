const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const portfolioVid = new Schema({
  title: {
    type: String,
    required: true,
  },
  vidId: { type: String, required: true },
  player: { type: String, required: true },
  category: { type: String, required: true },

  image: { type: String, required: true },
});

module.exports = mongoose.model("PortfolioVid", portfolioVid);
