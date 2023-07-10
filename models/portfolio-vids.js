const { Int32 } = require("mongodb");
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
  order: { type: Number },
  number: { type: Number },
  isPublicRated: { type: Boolean },
  isEmbeddable: { type: Boolean },
  regionRestricted: { type: Object },
});

module.exports = mongoose.model("PortfolioVid", portfolioVid);
