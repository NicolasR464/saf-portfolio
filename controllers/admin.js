const HomeImg = require("../models/home-imgs");
const AboutInfo = require("../models/about-info");
const PortfolioVid = require("../models/portfolio-vids");
const fileHelper = require("../util/file");
const VideoPlr = require("../util/vdo-handler");
const { count } = require("../models/home-imgs");

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
        pageTitle: "About | Bio & profile pic",
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
    .sort({ order: 1 })
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
  console.log(videoUrl);

  let order = 0;
  let number = 0;

  PortfolioVid.find({ category: videoCategory })
    .count()
    .then((num) => {
      number = num;
      order = num++;
    })
    .then(() => {
      const videoPlr = new VideoPlr(videoUrl);
      const extractId = videoPlr.idExtractor();
      console.log(videoPlr.category);
      const vidPlr = videoPlr.category;
      //
      const videoNew = new PortfolioVid({
        title: videoTitle,
        vidId: extractId,
        player: vidPlr,
        category: videoCategory,
        image: videoImage,
        order: order,
        number: number,
      });
      videoNew
        .save()
        .then(() => {
          number++;
          console.log("New video saved in portfolio 🔥");
          res.status(201).redirect("/admin/portfolio-config");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePortfolioVid = (req, res, next) => {
  const vidId = req.params.vidId;
  //!!! UPDATE THE 'NUMBER' FIELD + 'ORDER' FIELD
  PortfolioVid.findById(vidId)
    .then((vid) => {
      if (!vid) {
        return next(new Error("vid not found."));
      }
      fileHelper.deleteFile(vid.image);
      return PortfolioVid.deleteOne({ _id: vidId });
    })
    .then(() => {
      console.log("video port deleted");
      res.status(200).json({ message: "delete successs!" });
    });
};

exports.updatePortfolioVid = (req, res, next) => {
  const newOrder = req.params.newOrder;
  const category = newOrder.split("-")[0];
  const order = newOrder.split("-")[1].split("");
  console.log({ order });
  let changeCount = 0;
  PortfolioVid.find({ category: category })
    // .sort({ order: 1 })

    .then((docs) => {
      docs.forEach((doc, item) => {
        doc.order = order[item];
        doc
          .save()
          .then(() => {
            console.log("done");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .then(() => {
      console.log("update done ");
      // console.log("update done: " + changeCount++);
      res.status(200);
    })
    .catch((err) => console.log(err));
};
