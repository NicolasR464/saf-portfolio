const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");
const app = express();
const path = require("path");
const device = require("express-device");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");

const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24 * 30,
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
//app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        "https://res.cloudinary.com/niikkoo/image/upload/c_fill,f_auto,q_auto/v1/saf_portfolio/index/xf2vsxsgbof9hfrkqdfy",
        "https://res.cloudinary.com/niikkoo/image/upload/c_fill,f_auto,h_949,q_auto,w_534,x_644,y_15/v1/saf_portfolio/index/xf2vsxsgbof9hfrkqdfy",
      ],

      scriptSrc: [
        "'self'",
        "player.vimeo.com/api/player.js",
        "cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        "cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.min.js",
        "kit.fontawesome.com/766e633129.js",
        "youtube.com",
        "vimeo.com",
        "youtube.com/iframe_api",
        "res.cloudinary.com",
        "https://fonts.googleapis.com/css2?family=Spartan:wght@200&display=swap",
        "https://fonts.googleapis.com/css2?family=Poiret+One&display=swap",
        "https://res.cloudinary.com/niikkoo/",
        "https://res.cloudinary.com/niikkoo/image/upload/c_fill,f_auto,h_949,q_auto,w_534,x_644,y_15/v1/saf_portfolio/index/xf2vsxsgbof9hfrkqdfy",
        "https://res.cloudinary.com/niikkoo/image/upload/c_fill,f_auto,q_auto/v1/saf_portfolio/index/xf2vsxsgbof9hfrkqdfy",
      ],
      styleSrc: [
        "'self'",
        "cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css",
        "cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.6/cropper.min.css",
      ],
      fontSrc: [
        "https://fonts.googleapis.com/css2?family=Spartan:wght@200&display=swap",
        "https://fonts.googleapis.com/css2?family=Poiret+One&display=swap",
      ],
      imgSrc: ["'self'", "cloudinary.com"],
      reportUri: "/report-violation",
      objectSrc: [],
    },
    reportOnly: false,
  })
);

app.use(compression());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.use(flash());
//
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(portfolioRoutes);

app.use((req, res, next) => {
  res.redirect("/");
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
