const express = require("express");
const adminController = require("../controllers/admin");
const multer = require("multer");

const fileUpload = multer();
//{ storage: memoryStorage(), dest: "./tmp" }
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
router.post(
  "/about-config",
  fileUpload.single("image"),
  adminController.postAboutConfig
);

router.get("/portfolio-config", adminController.getPortfolioConfig);
router.post(
  "/portfolio-config",
  fileUpload.single("image"),
  adminController.postPortfolioConfig
);
router.delete("/portfolio-config/:vidId", adminController.deletePortfolioVid);
router.post("/portfolio-config/:newOrder", adminController.updatePortfolioVid);

router.get("/login", adminController.getlogin);
router.post("/login", adminController.postlogin);

router.post("/logout", adminController.postLogout);

module.exports = router;
