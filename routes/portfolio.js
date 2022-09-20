const express = require("express");
const router = express.Router();

const portfolioContr = require("../controllers/portfolio");
// const portfolioVids = require("../models/portfolio-vids");

router.get("/", portfolioContr.getIndex);
router.get("/home/:orientation", portfolioContr.getIndex);
router.get("/about", portfolioContr.getAbout);
router.get("/portfolio", portfolioContr.getPortfolio);
router.get("/contact", portfolioContr.getContact);
router.post("/contact", portfolioContr.postContact);
router.get("/thanks", (req, res, next) => {
  res.render("portfolio/thanks", {
    pageTitle: "Thanks",
    path: "/",
  });
});

module.exports = router;
