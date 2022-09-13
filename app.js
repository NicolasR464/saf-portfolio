const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv/config");
const app = express();
const path = require("path");
const device = require("express-device");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});
const flash = require("connect-flash");
//

app.set("view engine", "ejs");
app.set("views", "views");
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());
//
const adminRoutes = require("./routes/admin");
const portfolioRoutes = require("./routes/portfolio");
//
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());
//
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(portfolioRoutes);

app.use((req, res, next) => {
  res.send("404 page not found!");
});
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
