const AboutInfo = require("../models/about-info");
const PortfolioInfo = require("../models/portfolio-vids");
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.getIndex = (req, res, next) => {
  const device = req.device.type;
  console.log({ device });
  const orientation = req.params.orientation;
  console.log(orientation);

  cloudinary.api
    .resources({ type: "upload", prefix: "saf_portfolio/index" })
    .then((imgs) => {
      // console.log(imgs);

      let URLs = [];

      imgs.resources.forEach((img) => {
        URLs.push(
          cloudinary.url(img.public_id, {
            secure: true,
            transformation: {
              aspect_ratio: "16:9",
              crop: "fill",
              fetch_format: "auto",
              quality: "auto",
            },
          })
        );
      });
      // console.log({ URLs });

      res.render("portfolio/index", {
        pageTitle: "Home",
        path: "/",
        imgs: URLs,
      });
    })
    .catch((err) => console.log(err));
  //
  //
  // let totalImgs;
  // HomeImg.find()
  //   .countDocuments()
  //   .then((numImgs) => {
  //     totalImgs = numImgs;
  //     return HomeImg.find();
  //   })
  //   .then((imgs) => {
  //     res.render("portfolio/index", {
  //       pageTitle: "Home",
  //       path: "/",
  //       imgs: imgs,
  //     });
  //   })
  //   .catch((err) => console.log(err));
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
