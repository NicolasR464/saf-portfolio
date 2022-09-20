const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const imgHandler = async (req, folder, file, tags, metadata) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        {
          folder: `saf_portfolio/${folder}`,
          tags: tags,
          context: metadata,
        },
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
    return result;
  }

  return upload(req);
};

module.exports = imgHandler;
