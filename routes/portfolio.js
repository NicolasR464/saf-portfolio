const express = require("express");
const router = express.Router();

const portfolioContr = require("../controllers/portfolio");
// const portfolioVids = require("../models/portfolio-vids");

router.get("/", portfolioContr.getIndex);
router.get("/about", portfolioContr.getAbout);

module.exports = router;
