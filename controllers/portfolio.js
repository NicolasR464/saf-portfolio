const HomeImg = require("../models/home-imgs");
const AboutInfo = require("../models/about-info");

exports.getIndex = (req, res, next) => {
  let totalImgs;
  HomeImg.find()
    .countDocuments()
    .then((numImgs) => {
      console.log(numImgs);
      totalImgs = numImgs;
      return HomeImg.find();
    })
    .then((imgs) => {
      console.log(imgs);
      res.render("portfolio/index", {
        pageTitle: "Home",
        path: "/",
        imgs: imgs,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAbout = (req, res, next) => {
  AboutInfo.findOne()
    .then((info) => {
      res.render("portfolio/about", {
        pageTitle: "About",
        path: "/about",
        info: info,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
