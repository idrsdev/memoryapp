import express from "express";
import upload from "../utils/uploadImage.js";

const router = express.Router();

router.route("/image").post(upload.single("image"), (req, res) => {
  if (!(req.file && req.file.path)) {
    res.status(400);
    throw new Error("Please Upload an Image");
  }

  const imageUrl = `http://${req.headers.host}/${req.file.path.replace(
    /(\\)/g,
    "/"
  )}`;

  res.status(201).json({
    imageUrl,
    message: req.body.successMessage,
  });
});

export default router;
