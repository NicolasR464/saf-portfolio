const AboutInfo = require("../models/about-info");
const PortfolioInfo = require("../models/portfolio-vids");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
//

exports.getIndex = (req, res, next) => {
  const isLogged = req.session.isLoggedIn;
  const device = req.device.type;
  const orientation = req.params.orientation;
  let URLs = [];

  if (orientation == "landscape" || device == "desktop") {
    cloudinary.api
      .resources({
        type: "upload",
        prefix: "saf_portfolio/index",
        max_results: 500,
      })
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

        if (!orientation) {
          res.render("portfolio/index", {
            pageTitle: "Home",
            path: "/",
            imgs: URLs,
            isLogged: isLogged,
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
    cloudinary.api
      .resources_by_tag("phone-option", {
        context: true,
      })
      .then((imgs) => {
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

        if (!orientation) {
          res.render("portfolio/index", {
            pageTitle: "Home",
            path: "/",
            imgs: URLs,
            isLogged: isLogged,
          });
        } else {
          res.status(200).json({
            message: "new URLs",
            URLs: URLs,
          });
        }
      });
  }
};

exports.getAbout = (req, res, next) => {
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

exports.getPortfolio = (req, res, next) => {
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
exports.getContact = (req, res, next) => {
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

exports.postContact = (req, res, next) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: "nicolas.rocagel@gmail.com",
    from: "safranlecuivre.com",
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
      req.flash("error", error.response.body.errors[0].message);
      res.redirect("/contact");
    });
};
