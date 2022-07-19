const HomeImg = require("../models/home-imgs");

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
