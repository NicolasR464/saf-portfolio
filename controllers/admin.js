const Home = require("../models/home");

exports.getHomeConfig = (req, res, next) => {
  res.render("admin/home", {
    pageTitle: "home",
    path: "/admin/home",
  });
};

exports.postHomeConfig = (req, res, next) => {
  const text = req.body.text;
  const image = req.file;
  const imageUrl = image.path;
  console.log(imageUrl);
  console.log(text);

  const home = new Home({
    text: text,
    image: imageUrl,
  });
  home
    .save()
    .then(() => {
      console.log("image added!");
    })
    .catch((err) => {
      console.log(err);
    });
};
