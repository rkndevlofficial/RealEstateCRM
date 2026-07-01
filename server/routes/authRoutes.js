const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait 15 minutes and try again.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please wait and try again later.",
  },
});

const createActivityLog = async ({
  req,
  action,
  module: logModule,
  message,
  targetId = null,
  targetName = "",
  adminId = null,
  adminName = "System",
  adminEmail = "",
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      action,
      module: logModule,
      message,
      targetId,
      targetName,
      adminId,
      adminName,
      adminEmail,
      ipAddress: req.ip || "",
      userAgent: req.get("user-agent") || "",
      metadata,
    });
  } catch (error) {
    console.log("Activity log error:", error.message);
  }
};

const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

const sanitizeText = (value) => {
  return String(value || "").trim();
};

const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  if (!password) return false;

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return strongPasswordRegex.test(password);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role || "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    if (user.role && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please login again.",
    });
  }
};

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const name = sanitizeText(req.body.name);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const setupKey = sanitizeText(req.body.setupKey);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    if (
      process.env.ADMIN_SETUP_KEY &&
      setupKey !== process.env.ADMIN_SETUP_KEY
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin setup key",
      });
    }

    const totalUsers = await User.countDocuments();

    if (totalUsers > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists. Registration is disabled.",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and number",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await createActivityLog({
      req,
      action: "ADMIN_REGISTERED",
      module: "Auth",
      message: `Admin registered: ${user.email}`,
      targetId: user._id,
      targetName: user.name,
      adminId: user._id,
      adminName: user.name,
      adminEmail: user.email,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
    });
  } catch (error) {
    console.log("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.role && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    await createActivityLog({
      req,
      action: "ADMIN_LOGIN",
      module: "Auth",
      message: `Admin login: ${user.email}`,
      targetId: user._id,
      targetName: user.name,
      adminId: user._id,
      adminName: user.name,
      adminEmail: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

router.get("/me", verifyAdminToken, async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin verified",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || "admin",
    },
  });
});

router.put("/change-password", verifyAdminToken, async (req, res) => {
  try {
    const currentPassword = String(req.body.currentPassword || "");
    const newPassword = String(req.body.newPassword || "");
    const confirmPassword = String(req.body.confirmPassword || "");

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password is required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 8 characters and include uppercase, lowercase, and number",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;

    await user.save();

    await createActivityLog({
      req,
      action: "PASSWORD_CHANGED",
      module: "Auth",
      message: `Password changed: ${user.email}`,
      targetId: user._id,
      targetName: user.name,
      adminId: user._id,
      adminName: user.name,
      adminEmail: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.log("Change password error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

module.exports = router;