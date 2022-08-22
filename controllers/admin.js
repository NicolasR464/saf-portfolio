const AboutInfo = require("../models/about-info");
const PortfolioVid = require("../models/portfolio-vids");
const SafInfo = require("../models/saf-model");
const fileHelper = require("../util/file");
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

const path = require("path");
const session = require("express-session");
const { rmSync } = require("fs");
require("dotenv/config");
const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier");
let metadata = null;
let tags = null;
let buttonTxt;
//

exports.getHomeConfig = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  let message = req.flash("valid");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

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
        flashMsg: message,
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

    metadata = {
      cropX: cropX,
      cropY: cropY,
      cropWidth: cropWidth,
      cropHeight: cropHeight,
    };
  }

  imgHandler(req, folder, file, tags, metadata).then((info) => {
    req.flash("valid", "new home page still uploaded 🔥");
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
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  let message = req.flash("valid");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  AboutInfo.findOne()
    .then((info) => {
      res.render("admin/about-config", {
        pageTitle: "About | Bio & profile pic",
        path: "/admin/about-config",
        bio: info,
        flashMsg: message,
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
    console.log({ err });
  }

  const save = (content) => {
    content
      .save()
      .then(() => {
        req.flash("valid", "Updated 👌");
        console.log("bio updated");
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
      // console.log(vidsInfo);
      res.render("admin/portfolio-config", {
        pageTitle: "Portfolio | add video ",
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
  const videoTitle = req.body.title.trim();
  const videoUrl = req.body.vidId.trim();
  const videoFolder = req.body.folder;
  const videoCategory = req.body.category;
  const videoImage = req.file.buffer;
  let isPublicRated = true;
  let isEmbeddable = true;
  console.log({ videoUrl });
  //
  let order = 0;
  let number = 0;
  //
  const videoPlr = new VideoPlr(videoUrl);
  const extractId = videoPlr.idExtractor();
  console.log(videoPlr.type);
  const vidPlr = videoPlr.type;
  console.log({ extractId });

  //FUNCTIONS
  const saveVideo = () => {
    PortfolioVid.find({ category: videoCategory })
      .count()
      .then((num) => {
        number = num;
        order = num++;
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
            // console.log(newImg);

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
                console.log(video);
                number++;
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

  const errorHandling = () => {
    console.log("url off");
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
    const parameter = "&part=contentDetails&";
    const ytURL = baseUri + ytKey + parameter + "id=" + extractId;
    console.log(ytURL);
    axios
      .get(ytURL)
      .then((info) => {
        console.log(info.data.items);
        console.log(info.data.items[0].contentDetails.contentRating.ytRating);
        console.log(info.data.pageInfo);
        console.log(info.data.pageInfo.totalResults);

        info.data.items[0].contentDetails.contentRating.ytRating ==
        "ytAgeRestricted"
          ? (isPublicRated = false)
          : isPublicRated;

        const idExists = info.data.pageInfo.totalResults;
        if (idExists == 1) {
          saveVideo();
          return;
        } else {
          errorHandling();
        }
      })
      .catch((err) => console.log(err));
  } else if (vidPlr == "vimeo") {
    //VIMEO API
    let idCheck = extractId;
    extractId.includes("/") ? (idCheck = idCheck.replace("/", ":")) : idCheck;
    console.log("new extract: ", extractId);
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
        console.log(body);

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

//LOGIN
exports.getlogin = (req, res, next) => {
  let logValid = req.flash("valid");
  console.log({ logValid });
  if (logValid.length > 0) {
    logValid = logValid[0];
  } else {
    logValid = undefined;
  }
  // let innerText;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  console.log(req.session.isLoggedIn);
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
  console.log(errors);
  console.log(errors.array().length);
  if (!errors.isEmpty()) {
    console.log(errors);
    let errorMsg;
    errors.array().length > 1
      ? (errorMsg = errors.array()[0].msg + " " + errors.array()[1].msg)
      : (errorMsg = errors.array()[0].msg);
    console.log("errors :( : ", errors.array()[0].msg);
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
            console.log("log created");
            req.flash(
              "valid",
              "Password created! 🥳 You may now log in. Ps: Check your email."
            );
            //send an email to Saf with password info + Vimeo explainer video link
            res.redirect("/admin/login");
          });
      }
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    //delete session in db
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

  //random hash
  const buf = crypto.randomBytes(20);
  console.log("The random bytes of data generated is: " + buf.toString("utf8"));
  randomHash = buf.toString("hex");
  console.log({ randomHash });

  //save hash to db
  SafInfo.findOne().then((info) => {
    console.log(info);
    if (!info) {
      console.log("couldn't find info in db");
      return res.redirect("/admin/login");
    }
    info.resetpwd = randomHash;
    info.save();
  });

  //send email
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("sendgrid api: ", process.env.SENDGRID_API_KEY);
  const msg = {
    to: "nicolas.rocagel@gmail.com", // Change to your recipient
    from: "nicolas.rocagel@gmail.com", // Change to your verified sender
    subject: "Password reset",
    html:
      `<p>You got this email because you forgot your log in password to your website. It's okay, it happens (to literally everybody) 🤷🏻‍♂️ - </p>` +
      `<p>http://${req.headers.host}/admin/pwdreset/${randomHash}</p>` +
      `
    <p><a href="http://localhost:5500/admin/pwdreset/${randomHash}">Click here to reset your password<a/></p>`,
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
  console.log("get reset page");
  //
  let errorMsg = req.flash("error");
  console.log("errorMsg before transfo: ", errorMsg);
  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0];
  } else {
    errorMsg = null;
  }
  console.log({ errorMsg });
  //check randomHash from req.params
  const token = req.params.token;
  console.log({ token });
  SafInfo.findOne({ resetpwd: token })
    .then((user) => {
      if (!user) {
        req.flash("error", "The token to reset password is invalid.");
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
  //render form
  //store new pwd
};

exports.postPwdreset = (req, res, next) => {
  const validationErrs = validationResult(req);
  console.log(validationErrs);
  console.log("post reset page");
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
    console.log("pwd don't match");
    req.flash("error", "Passwords don't match, try again!");
    return res.redirect(`/admin/pwdreset/${token}`);
  }

  SafInfo.findOne()
    .then((info) => {
      //encrypt pwd!
      console.log(info);
      info.password = pwd;
      info.save();
    })
    .then(() => {
      console.log("passwrd changed!");
      req.flash("valid", "Password changed!");
      res.redirect("/admin/login");
      //send confirmation email
    });
};
