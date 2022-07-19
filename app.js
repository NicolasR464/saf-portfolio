const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv/config");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "views");
//
app.use(bodyParser.urlencoded({ extended: false }));
//
const adminRoutes = require("./routes/admin");
const portfolioRoutes = require("./routes/portfolio");
//
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  }
  cb(null, false);
};
//
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); //
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", adminRoutes);
app.use(portfolioRoutes);
//
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
    app.listen(process.env.PORT || 5500);
  })
  .catch((err) => {
    console.log(err);
  });
