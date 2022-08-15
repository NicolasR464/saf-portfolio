const AboutInfo = require("../models/about-info");
const PortfolioInfo = require("../models/portfolio-vids");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
//
//

exports.getIndex = (req, res, next) => {
  const device = req.device.type;
  const orientation = req.params.orientation;
  let URLs = [];
  console.log({ device });
  console.log({ orientation });

  if (orientation == "landscape" || device == "desktop") {
    // URLs = [];
    console.log("laptop or landscape version");
    cloudinary.api
      .resources({ type: "upload", prefix: "saf_portfolio/index" })
      .then((imgs) => {
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
        console.log({ URLs });

        if (!orientation) {
          res.render("portfolio/index", {
            pageTitle: "Home",
            path: "/",
            imgs: URLs,
          });
        } else {
          res.status(200).json({
            message: "new URLs",
            URLs: URLs,
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    // URLs = [];
    console.log("portrait mode");

    cloudinary.api
      .resources_by_tag("phone-option", {
        context: true,
      })
      .then((imgs) => {
        // console.log(imgs);
        imgs.resources.forEach((img) => {
          URLs.push(
            cloudinary.url(img.public_id, {
              secure: true,
              transformation: {
                fetch_format: "auto",
                quality: "auto",
                height: img.context.custom.cropHeight,
                width: img.context.custom.cropWidth,
                x: img.context.custom.cropX,
                y: img.context.custom.cropY,
                crop: "crop",
              },
            })
          );
        });
        console.log("Phone V URLs: : ", URLs);
        if (!orientation) {
          res.render("portfolio/index", {
            pageTitle: "Home",
            path: "/",
            imgs: URLs,
          });
        } else {
          //json
          res.status(200).json({
            message: "new URLs",
            URLs: URLs,
          });
        }
      });
  }
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

//contact
exports.getContact = (req, res, next) => {
  res.render("portfolio/contact", {
    pageTitle: "Contact",
  });
  //mail

  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  //
};

exports.postContact = (req, res, next) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("sendgrid api: ", process.env.SENDGRID_API_KEY);
  const msg = {
    to: "nicolas.rocagel@gmail.com", // Change to your recipient
    from: email, // Change to your verified sender
    subject: subject,
    text: message,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.redirect("/contact");
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/contact");
    });
};
