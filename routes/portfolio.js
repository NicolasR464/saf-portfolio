const express = require("express");
const router = express.Router();

const portfolioContr = require("../controllers/portfolio");

router.get("/", portfolioContr.getIndex);
router.get("/about", portfolioContr.getAbout);

module.exports = router;
