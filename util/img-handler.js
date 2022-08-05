const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const imgHandler = async (req, folder, file) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        { folder: `saf_portfolio/${folder}` },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(file).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  return upload(req);
  //.then((info) => {
  //   res.status(201).redirect("/admin/home-config");
  //   console.log("cloudinary uploaded 🥳");
  //   console.log({ info });
  // });
};

module.exports = imgHandler;
