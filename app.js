const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv/config");
const app = express();
const path = require("path");

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

app.set("view engine", "ejs");
app.set("views", "views");
//
app.use(bodyParser.urlencoded({ extended: false }));
//
const adminRoutes = require("./routes/admin");
const portfolioRoutes = require("./routes/portfolio");
//
// const fileStorage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     if (req.body.event == "home") {
//       cb(null, "images/home");
//     } else if (req.body.event == "about") {
//       cb(null, "images/about");
//     } else if (req.body.event == "portfolio") {
//       switch (req.body.category) {
//         case "mv":
//           cb(null, "images/portfolio/mv");
//           break;
//         case "narrative":
//           cb(null, "images/portfolio/narrative");
//         case "reel":
//           cb(null, "images/portfolio/reel");
//         case "commercial":
//           cb(null, "images/portfolio/commercial");
//       }
//     } else {
//       cb(null, "images");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//     cb(null, true);
//   }
//   cb(null, false);
// };
// //
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
//
//
// CLOUDINARY + MULTER
const fileUpload = multer();
//
app.post("/upload", fileUpload.single("image"), function (req, res, next) {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
  }

  upload(req).then(() => {
    console.log("cloudinary uploaded 🥳");
    res.status(201).redirect("/admin/home-config");
  });
});

//
//
//
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", adminRoutes);
app.use(portfolioRoutes);
//
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("🚀");
    app.listen(process.env.PORT || 5500);
  })
  .catch((err) => {
    console.log(err);
  });
