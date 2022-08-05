const express = require("express");
const router = express.Router();

const portfolioContr = require("../controllers/portfolio");
// const portfolioVids = require("../models/portfolio-vids");

router.get("/", portfolioContr.getIndex);
router.get("/home/:orientation", portfolioContr.getIndex);
router.get("/about", portfolioContr.getAbout);
router.get("/portfolio", portfolioContr.getPortfolio);

module.exports = router;
