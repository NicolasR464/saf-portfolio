const express = require("express");
const adminController = require("../controllers/admin");

const router = express.Router();

//
router.get("/home-config", adminController.getHomeConfig);
router.post("/home-config", adminController.postHomeConfig);

module.exports = router;
