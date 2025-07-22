import multer from "multer";
import { v1 as uuid } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const extract = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + extract);
    },
  }), //storage key => important for storing file correctly

  fileFilter: (req, file, cb) => {
    // undef/null=> false, valid minetypes =>true
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type");
    cb(error, isValid);
  }, //validate file
}); //object with pre confgiured middlewares

export default fileUpload;
