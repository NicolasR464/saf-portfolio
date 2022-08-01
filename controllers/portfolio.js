const HomeImg = require("../models/home-imgs");
const AboutInfo = require("../models/about-info");
const PortfolioInfo = require("../models/portfolio-vids");

exports.getIndex = (req, res, next) => {
  let totalImgs;
  HomeImg.find()
    .countDocuments()
    .then((numImgs) => {
      totalImgs = numImgs;
      return HomeImg.find();
    })
    .then((imgs) => {
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

exports.getPortfolio = (req, res, next) => {
  PortfolioInfo.find()
    .sort({ order: 1 })
    .then((vidInfo) => {
      res.render("portfolio/portfolio", {
        pageTitle: "Portfolio",
        vidInfo: vidInfo,
      });
    });
};
