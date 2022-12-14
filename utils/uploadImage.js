import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `./uploads/images/`;
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);

    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const dateStr =
      new Date().toISOString().replace(/:/g, "-") ||
      Date.now() + path.extname(file.originalname);

    const baseName = path.basename(
      file.originalname.replace(/\s/g, ""),
      path.extname(file.originalname)
    );

    const extension = path.extname(file.originalname);
    const fileName = baseName + extension || file.originalname;

    cb(null, dateStr + fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Allowed formats are ${allowedTypes}`), false);
};

const uploadImage = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 1,
  },
  fileFilter,
});

export default uploadImage;
