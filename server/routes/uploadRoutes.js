const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, or WEBP images are allowed"), false);
  }
};

const brochureFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF brochure is allowed"), false);
  }
};

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});

const brochureUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: brochureFileFilter,
});

/* Cover Image Upload - Admin Only */
router.post("/image", protect, (req, res) => {
  imageUpload.single("image")(req, res, function (error) {
    if (error) {
      console.log("UPLOAD ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  });
});

/* Gallery Images Upload - Admin Only */
router.post("/gallery", protect, (req, res) => {
  imageUpload.array("images", 20)(req, res, function (error) {
    if (error) {
      console.log("GALLERY ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => file.path);

    return res.status(200).json({
      success: true,
      images: imageUrls,
    });
  });
});

/* Brochure PDF Upload - Admin Only */
router.post("/brochure", protect, (req, res) => {
  brochureUpload.single("brochure")(req, res, function (error) {
    if (error) {
      console.log("BROCHURE UPLOAD ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No brochure uploaded",
      });
    }

    return res.status(200).json({
      success: true,
      brochureUrl: req.file.path,
    });
  });
});

module.exports = router;