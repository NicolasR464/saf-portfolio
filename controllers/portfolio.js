const AboutInfo = require("../models/about-info");
const PortfolioInfo = require("../models/portfolio-vids");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
//

exports.getIndex = (req, res) => {
  const isLogged = req.session.isLoggedIn;
  const device = req.device.type;
  let URLs = [];

  console.log({ device });

  if (device === "desktop") {
    cloudinary.api
      .resources({
        type: "upload",
        prefix: "saf_portfolio/index",
        max_results: 500,
        tags: true,
      })
      .then((imgs) => {
        console.log("rate_limit_remaining: ", imgs.rate_limit_remaining);
        imgs.resources.forEach((img) => {
          if (!img.tags.includes("phone-option-only")) {
            URLs.push(
              cloudinary.url(img.public_id, {
                secure: true,
                transformation: {
                  aspect_ratio: "16:9",
                  crop: "lfill",
                  fetch_format: "auto",
                  quality: "auto",
                },
                loading: "lazy",
              })
            );
          }
        });

        res.render("portfolio/index", {
          pageTitle: "Home",
          path: "/",
          imgs: URLs,
          isLogged: isLogged,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/error");
      });

    ///////
  } else if (device === "phone" || device === "tablet") {
    cloudinary.api
      .resources_by_tag("phone-option", {
        context: true,
        max_results: 50,
        tags: true,
      })
      .then((imgs) => {
        const filteredImgs = imgs.resources.filter(
          (img) => !img.folder.startsWith("saf_portfolio/portfolio")
        );

        console.log(filteredImgs);

        const index = Math.floor(Math.random() * filteredImgs.length);
        const singleImg = filteredImgs[index];

        //image 9:16
        URLs.push(
          cloudinary.url(singleImg.public_id, {
            secure: true,
            transformation: {
              fetch_format: "auto",
              quality: "auto",
              height: singleImg.context.custom.cropHeight,
              width: singleImg.context.custom.cropWidth,
              x: singleImg.context.custom.cropX,
              y: singleImg.context.custom.cropY,
              crop: "crop",
            },
          })
        );

        //16:9
        URLs.push(
          cloudinary.url(singleImg.public_id, {
            secure: true,
            transformation: {
              fetch_format: "auto",
              quality: "auto",
              crop: "fill",
            },
          })
        );

        res.render("portfolio/index", {
          pageTitle: "Home",
          path: "/",
          imgs: URLs,
          isLogged: isLogged,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/error");
      });
  }
};

exports.getAbout = (req, res) => {
  const isLogged = req.session.isLoggedIn;

  AboutInfo.findOne()
    .then((info) => {
      res.render("portfolio/about", {
        pageTitle: "About",
        path: "/about",
        info: info,
        isLogged: isLogged,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPortfolio = (req, res) => {
  const isLogged = req.session.isLoggedIn;
  PortfolioInfo.find()
    .sort({ order: 1 })
    .then((vidInfo) => {
      vidInfo.forEach((vid) => {
        let newVidUrl = cloudinary.url(vid.image.public_id, {
          secure: true,
          transformation: {
            aspect_ratio: "16:9",
            crop: "fill",
            fetch_format: "auto",
            quality: "auto",
          },
        });
        vid.image.url = newVidUrl;
      });

      res.render("portfolio/portfolio", {
        pageTitle: "Portfolio",
        vidInfo: vidInfo,
        path: "/portfolio",
        isLogged: isLogged,
      });
    });
};

//contact
exports.getContact = (req, res) => {
  let errorMsg = req.flash("error");
  if (errorMsg.length > 0) {
    errorMsg[0];
  } else {
    errorMsg = null;
  }

  res.render("portfolio/contact", {
    pageTitle: "Contact",
    path: "/contact",
    errorMsg: errorMsg,
  });
};

exports.postContact = (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.WEBSITE_EMAIL,
    subject: subject,
    html:
      message + "<br><br>" + "<strong>My email address</strong> 👉 " + email,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.redirect("/thanks");
    })
    .catch((error) => {
      console.error(error);
      console.error(error.response.body.errors);
      console.error(error.response.body.errors[0].message);
      req.flash(
        "error",
        "Something went wrong when sending your e-mail. I invite you to try again later!"
      );
      res.redirect("/contact");
    });
};
