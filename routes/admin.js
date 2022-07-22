const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

//
router.get("/home-config", adminController.getHomeConfig);
router.post("/home-config", adminController.postHomeConfig);
router.delete("/home-config/:imgId", adminController.deleteHomeImg);

router.get("/about-config", adminController.getAboutConfig);
router.post("/about-config", adminController.postAboutConfig);

router.get("/portfolio-config", adminController.getPortfolioConfig);
router.post("/portfolio-config", adminController.postPortfolioConfig);

module.exports = router;
