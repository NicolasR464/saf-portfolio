const AboutInfo = require("../models/about-info");
const PortfolioVid = require("../models/portfolio-vids");
const SafInfo = require("../models/saf-model");
const VideoPlr = require("../util/vdo-handler");
const imgHandler = require("../util/img-handler");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const axios = require("axios");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

require("dotenv").config();

let Vimeo = require("vimeo").Vimeo;
let vimeoAPI = new Vimeo(
  process.env.VIMEO_CLIENT_IDENTIFIER,
  process.env.VIMEO_CLIENT_SECRET,
  process.env.VIMEO_ACCESS_TOKEN
);

require("dotenv/config");
const cloudinary = require("cloudinary").v2;

let metadata = null;
let tags = null;
let buttonTxt;
//

exports.getHomeConfig = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  let message = req.flash("valid");
  let errorMsg = req.flash("error");
  if (errorMsg.length > 0) {
    errorMsg[0];
  } else {
    errorMsg = null;
  }
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  cloudinary.api
    .resources({
      type: "upload",
      prefix: "saf_portfolio/index",
      max_results: 500,
      context: true,
    })
    .then((imgs) => {
      imgs.resources.forEach((img) => {
        console.log(img.context);
      });

      let URLs = [];

      imgs.resources.forEach((img) => {
        let phoneV;
        img.context != undefined ? (phoneV = true) : (phoneV = false);
        URLs.push({
          url: cloudinary.url(img.public_id, {
            secure: true,
            transformation: {
              aspect_ratio: "16:9",
              crop: "fill",
              fetch_format: "auto",
              quality: "auto",
            },
          }),
          phoneV: phoneV,
        });
      });

      res.render("admin/home-config", {
        pageTitle: "Home | Image upload",
        path: "/admin/home-config",
        imgs: URLs,
        flashMsg: message,
        errorMsg: errorMsg,
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

  const fileType = req.file.mimetype;

  if (fileType != "image/jpeg") {
    req.flash("error", "This file is not a jpeg, please try another.");
    return res.redirect("/admin/home-config");
  }

  //
  if (cropX) {
    console.log("phone");
    tags = "phone-option";

    metadata = {
      cropX: cropX,
      cropY: cropY,
      cropWidth: cropWidth,
      cropHeight: cropHeight,
    };
  }

  imgHandler(req, folder, file, tags, metadata)
    .then((info) => {
      req.flash("valid", "new home page image uploaded 🔥");
      res.status(201).redirect("/admin/home-config");
    })
    .catch((err) => {
      console.log({ err });
      req.flash("error", "This file can't be uploaded, please try another.");
      res.redirect("/admin/home-config");
    });
};

exports.deleteHomeImg = (req, res, next) => {
  const imgId = req.params.imgId.replaceAll("-", "/");

  if (!imgId) {
    return next(new Error("Img not found."));
  }

  cloudinary.uploader
    .destroy(imgId, { invalidate: true })
    .then((result) => {
      res.status(200).json({ message: "delete successs!" });
    })
    .catch((err) => {
      console.log(err);
    });
};

//About

exports.getAboutConfig = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  let message = req.flash("valid");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let errorMsg = req.flash("error");
  if (errorMsg.length > 0) {
    errorMsg[0];
  } else {
    errorMsg = null;
  }

  AboutInfo.findOne()
    .then((info) => {
      res.render("admin/about-config", {
        pageTitle: "About | Bio & profile pic",
        path: "/admin/about-config",
        bio: info,
        flashMsg: message,
        errorMsg: errorMsg,
      });
    })
    .catch((err) => console.log(err));
};
exports.postAboutConfig = (req, res, next) => {
  const folder = req.body.folder;
  const bioUpdate = req.body.bio;
  let imgUpdate = undefined;
  let fileType = undefined;
  try {
    imgUpdate = req.file.buffer;
    fileType = req.file.mimetype;
  } catch (err) {
    console.log({ err });
  }

  if (fileType != "image/jpeg" && fileType != undefined) {
    req.flash("error", "This file is not a jpeg, please try another.");
    return res.redirect("/admin/about-config");
  }

  const save = (content) => {
    content
      .save()
      .then(() => {
        req.flash("valid", "Updated 👌");
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
            content.image.url = newImg.secure_url;
            content.image.public_id = newImg.public_id;

            save(content);
          })
          .catch((err) => {
            console.log({ err });
            req.flash(
              "error",
              "This file can't be uploaded, please try another."
            );
            res.redirect("/admin/home-config");
          });
      } else {
        save(content);
      }
    })
    .catch((err) => console.log(err));
};

// Portfolio
exports.getPortfolioConfig = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }
  let errorMsg = req.flash("error");
  if (errorMsg.length > 0) {
    errorMsg[0];
  } else {
    errorMsg = null;
  }

  let message = req.flash("valid");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  PortfolioVid.find()
    .sort({ order: 1 })
    .then((vidsInfo) => {
      res.render("admin/portfolio-config", {
        pageTitle: "Portfolio | add video",
        path: "/admin/portfolio-config",
        vidsInfo: vidsInfo,
        flashMsg: message,
        errorMsg: errorMsg,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postPortfolioConfig = (req, res, next) => {
  const videoTitle = req.body.title.trim(); // string
  const videoUrl = req.body.vidId.trim(); // int || string
  const videoFolder = req.body.folder;
  const videoCategory = req.body.category;
  const videoImage = req.file.buffer;
  let isPublicRated = true;
  let isEmbeddable = true;
  let order = 0;
  let number = 0;
  const videoPlr = new VideoPlr(videoUrl);
  let extractId = videoPlr.idExtractor();
  const vidPlr = videoPlr.type;

  //JPEG CHECK
  const fileType = req.file.mimetype;

  if (fileType != "image/jpeg") {
    req.flash("error", "This file is not a jpeg, please try another.");
    return res.redirect("/admin/portfolio-config");
  }

  //FUNCTIONS
  const saveVideo = () => {
    PortfolioVid.find({ category: videoCategory })
      .count()
      .then((num) => {
        number = num;
        order = num;
      })
      .then(() => {
        //
        imgHandler(
          req,
          `${videoFolder}/${videoCategory}`,
          videoImage,
          tags,
          metadata
        )
          .then((newImg) => {
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
              isPublicRated: isPublicRated,
              isEmbeddable: isEmbeddable,
            });
            videoNew
              .save()
              .then((video) => {
                console.log("New video saved in portfolio 🔥");
                req.flash("valid", "new project uploaded 🤩");
                if (video.isPublicRated == false) {
                  req.flash(
                    "error",
                    "This video is not rated 'All audiences' or not rated at all 🔞. Visitors may be redirected to Vimeo or Youtube to watch it..."
                  );
                }
                if (video.isEmbeddable == false) {
                  req.flash(
                    "error",
                    "The owner of this video didn't set it up to be embeddable ❌"
                  );
                }

                res.status(201).redirect("/admin/portfolio-config");
              })
              .catch((err) => {
                console.log(err);
                req.flash("error", "Something went wrong, please try again.");
                cloudinary.uploader.destroy(newImg.public_id, {
                  invalidate: true,
                });
                res.redirect("/admin/portfolio-config");
              });
          })
          .catch((err) => {
            console.log({ err });
            req.flash(
              "error",
              "This image couln't be uploaded, please try again or another."
            );
            res.redirect("/admin/home-config");
          });
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", "Something went wrong, please try again.");
        res.redirect("/admin/portfolio-config");
      });
  };

  const errorHandling = () => {
    req.flash(
      "error",
      "Mh...there must be something off with the URL, please check it and try again."
    );
    return res.redirect("/admin/portfolio-config");
  };
  ////YT API - to check if the extracted id is real
  if (vidPlr == "yt") {
    const baseUri = "https://www.googleapis.com/youtube/v3/videos?";
    const ytKey = "key=" + process.env.YT_KEY;
    const parameter = "&part=contentDetails,status&";
    const ytURL = baseUri + ytKey + parameter + "id=" + extractId;

    axios
      .get(ytURL)
      .then((info) => {
        const idExists = info.data.pageInfo.totalResults;

        if (idExists == 1) {
          info.data.items[0].contentDetails.contentRating.ytRating ==
          "ytAgeRestricted"
            ? (isPublicRated = false)
            : isPublicRated;

          !info.data.items[0].status.embeddable
            ? (isEmbeddable = false)
            : isEmbeddable;

          saveVideo();
          return;
        } else {
          errorHandling();
        }
      })
      .catch((err) => {
        console.log(err);
        req.flash(
          "error",
          "Mh...there must be something off with the URL, please check it and try again."
        );
        return res.redirect("/admin/portfolio-config");
      });
  } else if (vidPlr == "vimeo") {
    //VIMEO API
    let idCheck = extractId;
    if (extractId.includes("?h=")) {
      extractId = extractId.split("?h=")[0];
      return saveVideo();
    }
    extractId.includes("/") ? (idCheck = idCheck.replace("/", ":")) : idCheck;

    vimeoAPI.request(
      {
        method: "GET",
        path: `videos/${idCheck}?fields=uri,name,content_rating,privacy`,
      },
      function (error, body, status_code, headers) {
        if (error) {
          console.log(error);
          errorHandling();
          return;
        }

        body.content_rating[0] != "safe"
          ? (isPublicRated = false)
          : isPublicRated;

        body.privacy.embed == "private" ? (isEmbeddable = false) : isEmbeddable;

        saveVideo();
      }
    );
  } else {
    errorHandling();
  }

  //
};

exports.deletePortfolioVid = (req, res, next) => {
  const vidId = req.params.vidId.trim();
  PortfolioVid.findById(vidId)
    .then((vid) => {
      if (!vid) {
        return next(new Error("vid not found."));
      }

      PortfolioVid.find({ category: vid.category })
        .updateMany({ number: { $gt: vid.number } }, { $inc: { number: -1 } })
        .then((update) => {
          PortfolioVid.find({ category: vid.category })
            .sort({ order: 1 })
            .then((docs) => {
              docs.forEach((doc, i) => {
                doc.order = i;

                doc
                  .save()
                  .then((result) => {
                    console.log("order updated after delete");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            });
          console.log({ update });
        });

      cloudinary.uploader
        .destroy(vid.image.public_id, { invalidate: true })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
      return PortfolioVid.deleteOne({ _id: vidId });
    })
    .then((info) => {
      res.status(200).json({ message: "delete successs!" });
    });
};

exports.updatePortfolioVid = (req, res, next) => {
  const newOrder = req.params.newOrder;
  const category = newOrder.split("-")[0];

  const order = newOrder.split(`${category}-`).pop().split("-");

  PortfolioVid.find({ category: category })

    .then((docs) => {
      docs.forEach((doc) => {
        let index = order.indexOf(doc.number.toString());
        doc.order = index;
        doc.save().catch((err) => {
          console.log(err);
        });
      });
    })
    .then((result) => {
      res.status(200);
    })
    .catch((err) => console.log(err));
};

//LOGIN
exports.getlogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/admin/portfolio-config");
  }
  let logValid = req.flash("valid");

  if (logValid.length > 0) {
    logValid = logValid[0];
  } else {
    logValid = undefined;
  }

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  SafInfo.findOne()
    .then((info) => {
      if (!info) {
        return "Create password";
      } else {
        return "LOG IN";
      }
    })
    .then((text) => {
      buttonTxt = text;
      res.render("admin/login", {
        pageTitle: "login",
        buttonTxt: text,
        errorMessage: message,
        flashMsg: logValid,
      });
    })
    .catch((err) => console.log(err));
};
exports.postlogin = (req, res, next) => {
  const logValid = undefined;
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let errorMsg;
    errors.array().length > 1
      ? (errorMsg = errors.array()[0].msg + " " + errors.array()[1].msg)
      : (errorMsg = errors.array()[0].msg);

    return res.status(422).render("admin/login", {
      pageTitle: "login",
      buttonTxt: buttonTxt,
      errorMessage: errorMsg,
      flashMsg: logValid,
    });
  }

  SafInfo.findOne()
    .then((info) => {
      if (info) {
        bcrypt
          .compare(password, info.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.save(() => {
                res.redirect("/admin/home-config");
              });
            } else {
              req.flash("error", "Invalid email or password");
              res.redirect("/admin/login");
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/admin/login");
          });
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new SafInfo({
              email: email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then(() => {
            const msg = {
              to: "safranlecuivre@gmail.com",
              from: "em7785.safranlecuivre.com",
              subject: "Your login password ",
              html: `<p>You just successfully created your password 🥳</p>`,
            };
            sgMail.send(msg).catch((error) => {
              console.error(error);
              return res.redirect("/admin/login");
            });

            req.flash(
              "valid",
              "Password created! 🥳 You may now log in. Ps: Check your email."
            );

            res.redirect("/admin/login");
          });
      }
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
};

//PWD RESET
let randomHash;
exports.getForgotPwd = (req, res, next) => {
  res.render("admin/pwdforgot", {
    pageTitle: "Email sent",
    actionPrompt: "emailPrompt",
  });
  req.session.destroy();

  //random hash
  const buf = crypto.randomBytes(20);
  randomHash = buf.toString("hex");

  //save hash to db
  SafInfo.findOne().then((info) => {
    if (!info) {
      return res.redirect("/admin/login");
    }
    info.resetpwd = randomHash;
    info.save();
  });

  //send email
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "safranlecuivre@gmail.com",
    from: "em7785.safranlecuivre.com",
    subject: "Password reset",
    html:
      `<p>You got this email because you forgot your log in password to your website. It's okay, it happens (to literally everybody) 🤷🏻‍♂️ - </p>` +
      `
    <p><a href="http://${req.headers.host}/admin/pwdreset/${randomHash}">Click here to reset your password<a/></p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      // res.redirect("/contact");
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/admin/login");
    });
};

exports.pwdreset = (req, res, next) => {
  //
  let errorMsg = req.flash("error");

  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0];
  } else {
    errorMsg = null;
  }

  const token = req.params.token;

  SafInfo.findOne({ resetpwd: token })
    .then((user) => {
      if (!user) {
        req.flash("error", "Password reset not granted.");
        return res.redirect("/admin/login");
      }

      res.render("admin/pwdreset", {
        pageTitle: "Reset password",
        errorMessage: errorMsg,
      });
    })
    .catch((err) => {
      console.log(err);
      // res.redirect("/admin/login");
    });
};

exports.postPwdreset = (req, res, next) => {
  const validationErrs = validationResult(req);
  console.log(validationErrs);

  const token = req.params.token;
  const pwd = req.body.password;
  const checkPwd = req.body.checkPwd;

  if (!validationErrs.isEmpty()) {
    let errorMsg;
    errorMsg = validationErrs.array()[0].msg;

    return res.status(422).render("admin/pwdreset", {
      pageTitle: "Reset password",
      errorMessage: errorMsg,
    });
  }

  if (pwd != checkPwd) {
    req.flash("error", "Passwords don't match, try again!");
    return res.redirect(`/admin/pwdreset/${token}`);
  }

  SafInfo.findOne()
    .then((info) => {
      bcrypt.hash(pwd, 12).then((hashedPwd) => {
        info.password = hashedPwd;
        info.resetpwd = "";
        info.save();
      });
    })
    .then(() => {
      //confirmation email
      const msg = {
        to: "safranlecuivre@gmail.com",
        from: "em7785.safranlecuivre.com",
        subject: "Your new password",
        html: `<p>You just successfully changed your password 🥳</p>`,
      };
      sgMail.send(msg).catch((error) => {
        console.error(error);
        res.redirect("/admin/login");
      });
      req.flash("valid", "Password changed!");
      res.redirect("/admin/login");
    });
};
