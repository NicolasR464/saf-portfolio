const AboutInfo = require("../models/about-info");
const PortfolioVid = require("../models/portfolio-vids");
const SafInfo = require("../models/saf-model");
const fileHelper = require("../util/file");
const VideoPlr = require("../util/vdo-handler");
const imgHandler = require("../util/img-handler");

const path = require("path");
require("dotenv/config");
const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");
let metadata = null;
let tags = null;
//

exports.getHomeConfig = (req, res, next) => {
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

      res.render("admin/home-config", {
        pageTitle: "Home | Image upload",
        path: "/admin/home-config",
        imgs: URLs,
      });
    })
    .catch((err) => console.log(err));
};

exports.postHomeConfig = (req, res, next) => {
  const folder = req.body.folder;
  const file = req.file.buffer;
  const cropX = req.body.cropX;
  const cropY = req.body.cropY;
  const cropWidth = req.body.cropWidth;
  const cropHeight = req.body.cropHeight;

  if (cropX) {
    console.log("phone");
    tags = "phone-option";
    // metadata = `hello_id=${cropWidth}❘hi_id=${cropY}`;
    metadata = {
      cropX: cropX,
      cropY: cropY,
      cropWidth: cropWidth,
      cropHeight: cropHeight,
    };
  }

  imgHandler(req, folder, file, tags, metadata).then((info) => {
    res.status(201).redirect("/admin/home-config");
    console.log("cloudinary uploaded 🥳");
    console.log({ info });
  });
};

exports.deleteHomeImg = (req, res, next) => {
  const imgId = req.params.imgId.replaceAll("-", "/");
  console.log(imgId);

  if (!imgId) {
    return next(new Error("Img not found."));
  }

  cloudinary.uploader
    .destroy(imgId, { invalidate: true })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "delete successs!" });
    })
    .catch((err) => {
      console.log(err);
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
  const folder = req.body.folder;
  const bioUpdate = req.body.bio;
  let imgUpdate = undefined;
  try {
    imgUpdate = req.file.buffer;
  } catch (err) {
    console.log(err);
  }

  const save = (content) => {
    content
      .save()
      .then(() => {
        res.redirect("/admin/about-config");
      })
      .catch((err) => console.log(err));
  };

  AboutInfo.findOne()
    .then((content) => {
      content.bio = bioUpdate;
      if (imgUpdate) {
        if (content.image) {
          cloudinary.uploader
            .destroy(content.image.public_id, { invalidate: true })
            .then()
            .catch((err) => console.log(err));
        }

        imgHandler(req, folder, imgUpdate, tags, metadata)
          .then((newImg) => {
            console.log(newImg.secure_url);
            //add image url to Mongodb
            content.image.url = newImg.secure_url;
            content.image.public_id = newImg.public_id;
            console.log(content.image.url);
            save(content);
          })
          .catch((err) => console.log(err));
      } else {
        save(content);
      }
    })
    .catch((err) => console.log(err));
};

// Portfolio
exports.getPortfolioConfig = (req, res, next) => {
  PortfolioVid.find()
    .sort({ order: 1 })
    .then((vidsInfo) => {
      console.log(vidsInfo);
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
  const videoTitle = req.body.title.trim();
  const videoUrl = req.body.vidId.trim();
  const videoFolder = req.body.folder;
  const videoCategory = req.body.category;
  const videoImage = req.file.buffer;
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
      console.log(videoPlr.type);
      const vidPlr = videoPlr.type;
      //
      imgHandler(
        req,
        `${videoFolder}/${videoCategory}`,
        videoImage,
        tags,
        metadata
      )
        .then((newImg) => {
          console.log(newImg);

          const videoNew = new PortfolioVid({
            title: videoTitle,
            vidId: extractId,
            player: vidPlr,
            category: videoCategory,
            image: {
              url: newImg.secure_url,
              public_id: newImg.public_id,
            },
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
              res.status(200).redirect("/admin/portfolio-config");
            });
        })
        .catch((err) => console.log(err));

      //
    })
    .catch((err) => {
      console.log(err);
      res.status(200).redirect("/admin/portfolio-config");
    });
};

exports.deletePortfolioVid = (req, res, next) => {
  const vidId = req.params.vidId.trim();
  PortfolioVid.findById(vidId)
    .then((vid) => {
      if (!vid) {
        return next(new Error("vid not found."));
      }

      //
      //UPDATE THE 'NUMBER' FIELD + 'ORDER' FIELD
      PortfolioVid.find({ category: vid.category })
        .updateMany({ number: { $gt: vid.number } }, { $inc: { number: -1 } })
        .then((update) => {
          console.log({ update });
        });

      // fileHelper.deleteFile(vid.image);
      cloudinary.uploader
        .destroy(vid.image.public_id, { invalidate: true })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      return PortfolioVid.deleteOne({ _id: vidId });
    })
    .then((info) => {
      console.log(info);
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

    .then((docs) => {
      docs.forEach((doc) => {
        // console.log("before: ", doc);
        let index = order.indexOf(doc.number.toString());
        // console.log({ index });
        doc.order = index;
        // console.log("after: ", doc);
        doc
          .save()
          .then((result) => {
            // console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .then((result) => {
      // console.log(result);
      console.log("update done ");
      // console.log("update done: " + changeCount++);
      res.status(200);
    })
    .catch((err) => console.log(err));
};

exports.getlogin = (req, res, next) => {
  res.render("admin/login", {
    pageTitle: "login",
  });
};
exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = new SafInfo({
    email: email,
    password: password,
  });
  user.save().then(() => {
    console.log("logged in");
    res.redirect("/admin/login");
  });
  // SafInfo.findOne({ email: email })
  //   .then((info) => console.log(info))
  //   .catchf((err) => console.log(err));

  // res.render("/admin/login");
};
