const express = require("express");
const adminController = require("../controllers/admin");
const multer = require("multer");
const fileUpload = multer();
const router = express.Router();
//
router.get("/home-config", adminController.getHomeConfig);
router.post(
  "/home-config",
  fileUpload.single("image"),
  adminController.postHomeConfig
);
router.delete("/home-config/:imgId", adminController.deleteHomeImg);

router.get("/about-config", adminController.getAboutConfig);
router.post("/about-config", adminController.postAboutConfig);

router.get("/portfolio-config", adminController.getPortfolioConfig);
router.post("/portfolio-config", adminController.postPortfolioConfig);
router.delete("/portfolio-config/:vidId", adminController.deletePortfolioVid);
router.post("/portfolio-config/:newOrder", adminController.updatePortfolioVid);

module.exports = router;
