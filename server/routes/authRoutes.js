const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

/* =========================================================
   RATE LIMITERS
========================================================= */

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

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reset attempts. Please try again later.",
  },
});

/* =========================================================
   ACTIVITY LOG HELPER
========================================================= */

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

/* =========================================================
   TEXT / VALIDATION HELPERS
========================================================= */

const normalizeEmail = (email) => {
  return String(email || "")
    .trim()
    .toLowerCase();
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

/* =========================================================
   JWT TOKEN
========================================================= */

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

/* =========================================================
   BREVO SMTP TRANSPORTER
========================================================= */

const createEmailTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP email configuration is missing");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/* =========================================================
   ADMIN AUTH MIDDLEWARE
========================================================= */

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

/* =========================================================
   REGISTER
========================================================= */

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

    return res.status(201).json({
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

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

/* =========================================================
   LOGIN
========================================================= */

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

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

/* =========================================================
   FORGOT PASSWORD
========================================================= */

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  async (req, res) => {
    try {
      const email = normalizeEmail(req.body.email);

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

      const user = await User.findOne({
        email,
        role: "admin",
      });

      /*
       SECURITY:
       Same response is returned whether or not
       the admin email exists.
      */

      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            "If an admin account exists with this email, a password reset link has been sent.",
        });
      }

      /*
       Generate secure random token.
       Only the SHA-256 hash is stored in MongoDB.
      */

      const rawResetToken = crypto.randomBytes(32).toString("hex");

      const hashedResetToken = crypto
        .createHash("sha256")
        .update(rawResetToken)
        .digest("hex");

      const resetTokenExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );

      user.resetPasswordToken = hashedResetToken;
      user.resetPasswordExpires = resetTokenExpires;

      await user.save();

      /*
       Frontend URL
      */

      const clientUrl =
        process.env.CLIENT_URL ||
        (process.env.CLIENT_URLS
          ? process.env.CLIENT_URLS.split(",")[0].trim()
          : "");

      if (!clientUrl) {
        console.log("CLIENT_URL is not configured");

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(500).json({
          success: false,
          message: "Password reset service is not configured",
        });
      }

      /*
       Reset link
      */

      const resetUrl = `${clientUrl.replace(
        /\/$/,
        ""
      )}/admin/reset-password/${rawResetToken}`;

      /*
       Brevo SMTP
      */

      const transporter = createEmailTransporter();

      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          `"RealEstateCRM" <${process.env.SMTP_USER}>`,

        to: user.email,

        subject: "Reset your RealEstateCRM admin password",

        text: `
Hello ${user.name},

We received a request to reset your RealEstateCRM admin password.

Please use the following link to create a new password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this password reset, you can safely ignore this email.

Regards,
RealEstateCRM
        `,

        html: `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Password Reset</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:14px;
      padding:32px;
      box-sizing:border-box;
    "
  >

    <h2
      style="
        margin:0 0 24px;
        color:#111827;
      "
    >
      RealEstateCRM
    </h2>

    <p
      style="
        font-size:16px;
        line-height:1.6;
        color:#374151;
      "
    >
      Hello ${user.name},
    </p>

    <p
      style="
        font-size:16px;
        line-height:1.6;
        color:#374151;
      "
    >
      We received a request to reset your admin password.
    </p>

    <div
      style="
        text-align:center;
        margin:32px 0;
      "
    >

      <a
        href="${resetUrl}"
        style="
          display:inline-block;
          padding:14px 26px;
          background:#4f46e5;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-size:15px;
          font-weight:bold;
        "
      >
        Reset Password
      </a>

    </div>

    <p
      style="
        font-size:14px;
        line-height:1.6;
        color:#6b7280;
      "
    >
      This reset link will expire in
      <strong>15 minutes</strong>.
    </p>

    <p
      style="
        font-size:14px;
        line-height:1.6;
        color:#6b7280;
      "
    >
      If you did not request a password reset, you can safely ignore this email.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:28px 0;
      "
    />

    <p
      style="
        margin:0;
        font-size:12px;
        color:#9ca3af;
      "
    >
      RealEstateCRM Admin System
    </p>

  </div>

</body>
</html>
        `,
      });

      await createActivityLog({
        req,
        action: "PASSWORD_RESET_REQUESTED",
        module: "Auth",
        message: `Password reset requested: ${user.email}`,
        targetId: user._id,
        targetName: user.name,
        adminEmail: user.email,
        metadata: {
          expiresInMinutes: 15,
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "If an admin account exists with this email, a password reset link has been sent.",
      });
    } catch (error) {
      console.log("Forgot password error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to process password reset request",
      });
    }
  }
);

/* =========================================================
   RESET PASSWORD
========================================================= */

router.post(
  "/reset-password/:token",
  resetPasswordLimiter,
  async (req, res) => {
    try {
      const rawResetToken = String(req.params.token || "");

      const newPassword = String(req.body.newPassword || "");

      const confirmPassword = String(req.body.confirmPassword || "");

      if (!rawResetToken) {
        return res.status(400).json({
          success: false,
          message: "Invalid password reset token",
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
            "Password must be at least 8 characters and include uppercase, lowercase, and number",
        });
      }

      const hashedResetToken = crypto
        .createHash("sha256")
        .update(rawResetToken)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedResetToken,

        resetPasswordExpires: {
          $gt: new Date(),
        },

        role: "admin",
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Password reset link is invalid or has expired",
        });
      }

      const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
      );

      if (isSamePassword) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from your old password",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;

      /*
       Invalidate reset token immediately
       after successful password reset.
      */

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      await createActivityLog({
        req,
        action: "PASSWORD_RESET",
        module: "Auth",
        message: `Admin password reset successfully: ${user.email}`,
        targetId: user._id,
        targetName: user.name,
        adminEmail: user.email,
      });

      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully. Please login with your new password.",
      });
    } catch (error) {
      console.log("Reset password error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to reset password. Please try again.",
      });
    }
  }
);

/* =========================================================
   GET CURRENT ADMIN
========================================================= */

router.get("/me", verifyAdminToken, async (req, res) => {
  return res.status(200).json({
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

/* =========================================================
   CHANGE PASSWORD WHILE LOGGED IN
========================================================= */

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

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again.",
    });
  } catch (error) {
    console.log("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

/* =========================================================
   EXPORT
========================================================= */

module.exports = router;