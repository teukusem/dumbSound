// import package here
const multer = require("multer");

exports.uploadFile = (imageSong, fileSong) => {
  // initialization multer diskstorage
  // make destination file for upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === imageSong) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed",
        };
        return cb(new Error("Only image files are allowed"), false);
      }
    }

    if (file.fieldname === fileSong) {
      if (!file.originalname.match(/\.(mp3)$/)) {
        req.fileValidationError = {
          message: "Only audio files are allowed!",
        };
        return cb(new Error("Only audio files are allowed!"), false);
      }
    }

    cb(null, true);
  };

  const sizeInMB = 100;
  const maxSize = sizeInMB * 1000 * 1000;

  // generate multer instance for upload include storage, validation and max file size
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageSong,
      maxCount: 1,
    },
    {
      name: fileSong,
      maxCount: 1,
    },
  ]); //untuk menentukan jumlah file

  // middleware handler
  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) return res.status(400).send(req.fileValidationError);

      // if (!req.file && !err)
      //   return res.status(400).send({
      //     message: "Please select files to upload"
      //   })

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file size 100MB",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
