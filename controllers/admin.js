const HomeImg = require("../models/home-imgs");
const AboutInfo = require("../models/about-info");
const PortfolioVid = require("../models/portfolio-vids");
const fileHelper = require("../util/file");
const VideoPlr = require("../util/vdo-handler");

exports.getHomeConfig = (req, res, next) => {
  HomeImg.find()
    .then((allImgs) => {
      res.render("admin/home-config", {
        pageTitle: "Home | Image upload",
        path: "/admin/home-config",
        imgs: allImgs,
      });
    })
    .catch((err) => console.log(err));
};

exports.postHomeConfig = (req, res, next) => {
  const event = req.body.event;
  const image = req.file;
  const imageUrl = image.path;
  const img = new HomeImg({
    image: imageUrl,
  });
  img
    .save()
    .then(() => {
      console.log("image added!");
      res.status(201).redirect("/admin/home-config");
    })
    .catch((err) => {
      throw new Error(err);
    });
};

exports.deleteHomeImg = (req, res, next) => {
  const imgId = req.params.imgId;
  HomeImg.findById(imgId)
    .then((img) => {
      if (!img) {
        return next(new Error("Img not found."));
      }
      fileHelper.deleteFile(img.image);
      return HomeImg.deleteOne({ _id: imgId });
    })
    .then(() => {
      console.log("img deleted");
      res.status(200).json({ message: "delete successs!" });
    });
};

//About

exports.getAboutConfig = (req, res, next) => {
  AboutInfo.findOne()
    .then((info) => {
      res.render("admin/about-config", {
        pageTitle: "About | test & image set up",
        path: "/admin/about-config",
        bio: info,
      });
    })
    .catch((err) => console.log(err));
};
exports.postAboutConfig = (req, res, next) => {
  const bioUpdate = req.body.bio;
  const imgUpdate = req.file;

  AboutInfo.findOne()
    .then((content) => {
      content.bio = bioUpdate;
      if (imgUpdate) {
        fileHelper.deleteFile(content.image);
        content.image = imgUpdate.path;
      }
      return content.save().then(() => {
        console.log("bio updated");
        res.redirect("/admin/about-config");
      });
    })
    .catch((err) => console.log(err));
};

// Portfolio
exports.getPortfolioConfig = (req, res, next) => {
  PortfolioVid.find()
    .then((vidsInfo) => {
      // console.log(vidsInfo);
      res.render("admin/portfolio-config", {
        pageTitle: "Portfolio | add video ",
        path: "/admin/portfolio-config",
        vidsInfo: vidsInfo,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postPortfolioConfig = (req, res, next) => {
  const videoTitle = req.body.title;
  const videoUrl = req.body.vidId;
  const videoCategory = req.body.category;
  const videoImage = req.file.path;

  const videoPlr = new VideoPlr(videoUrl);
  const extractId = videoPlr.idExtractor();
  const vidPlr = videoPlr.category;

  const videoNew = new PortfolioVid({
    title: videoTitle,
    vidId: extractId,
    player: vidPlr,
    category: videoCategory,
    image: videoImage,
  });
  videoNew
    .save()
    .then(() => {
      console.log("New video saved in portfolio 🔥");
      res.status(201).redirect("/admin/portfolio-config");
    })
    .catch((err) => {
      console.log(err);
    });
};
