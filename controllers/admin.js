const HomeImg = require("../models/home-imgs");
const AboutInfo = require("../models/about-info");
const fileHelper = require("../util/file");

exports.getHomeConfig = (req, res, next) => {
  HomeImg.find()
    .then((allImgs) => {
      console.log({ allImgs });
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
  console.log({ event });
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
  console.log("delete btn");
  console.log(imgId);
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
  AboutInfo.find()
    .then((info) => {
      console.log({ info });
      res.render("admin/about-config", {
        pageTitle: "About | test & image set up",
        path: "/admin/about-config",
      });
    })
    .catch((err) => console.log(err));
};
exports.postAboutConfig = (req, res, next) => {
  console.log("post");
  const bio = req.body.bio;
  const event = req.body.event;
  console.log(event);
  console.log("event: ", bio);
  const img = req.file;
  const imgPath = img.path;

  const aboutInfo = new AboutInfo({
    bio: bio,
    image: imgPath,
  });
  aboutInfo
    .save()
    .then(() => {
      console.log("bio added!");
      res.status(201).redirect("/admin/about-config");
    })
    .catch((err) => {
      throw new Error(err);
    });
};
