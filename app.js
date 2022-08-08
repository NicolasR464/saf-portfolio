const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv/config");
const app = express();
const path = require("path");
const device = require("express-device");

app.set("view engine", "ejs");
app.set("views", "views");
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());
//
const adminRoutes = require("./routes/admin");
const portfolioRoutes = require("./routes/portfolio");
//

//
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
    console.log("🚀");
    app.listen(process.env.PORT || 5500);
  })
  .catch((err) => {
    console.log(err);
  });
