const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");

const router = express.Router();

const upload = multer({ storage });

router.post("/image", upload.single("image"), (req, res) => {
  res.status(200).json({
    success: true,
    imageUrl: req.file.path,
  });
});

module.exports = router;