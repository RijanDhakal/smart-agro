import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

export const upload = multer({
  storage: storage,
});
