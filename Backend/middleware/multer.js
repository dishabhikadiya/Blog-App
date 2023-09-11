const multer = require("multer");
const path = require("path");
const imagespath = path.join("uplodes/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagespath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});
const imageuplodes = multer({ storage: storage }).single("images");
module.exports = imageuplodes;
