import express from "express";
import upload from "../utils/localSingleImgStorage.js";

const router = express.Router();

router.route("/image").post(upload.single("image"), (req, res) => {
  const imageUrl = `http://${req.headers.host}/${req.file.path.replace(
    "\\",
    "/"
  )}`;

  res.json({
    imageUrl,
    message: req.body.successMessage,
  });
});

export default router;
