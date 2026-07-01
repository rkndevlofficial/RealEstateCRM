const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const resetAdminPassword = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const newPassword = process.env.ADMIN_PASSWORD;

    if (!email) {
      console.log("❌ ADMIN_EMAIL is required");
      process.exit(1);
    }

    if (!newPassword) {
      console.log("❌ ADMIN_PASSWORD is required");
      process.exit(1);
    }

    if (newPassword.length < 8) {
      console.log("❌ Password must be at least 8 characters");
      process.exit(1);
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      console.log("❌ Admin user not found with this email:", email);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.role = "admin";

    await user.save();

    console.log("✅ Admin password reset successfully");
    console.log("Email:", user.email);

    process.exit(0);
  } catch (error) {
    console.log("❌ Reset password error:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();