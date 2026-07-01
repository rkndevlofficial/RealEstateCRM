const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

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

const createOrResetAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME || "Admin";
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email) {
      console.log("❌ ADMIN_EMAIL is required");
      process.exit(1);
    }

    if (!isValidEmail(email)) {
      console.log("❌ Enter a valid ADMIN_EMAIL");
      process.exit(1);
    }

    if (!password) {
      console.log("❌ ADMIN_PASSWORD is required");
      process.exit(1);
    }

    if (!isStrongPassword(password)) {
      console.log(
        "❌ Password must be at least 8 characters and include uppercase, lowercase, and number"
      );
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let user = await User.findOne({
      email,
    });

    if (user) {
      user.name = user.name || name;
      user.password = hashedPassword;
      user.role = "admin";

      await user.save();

      console.log("✅ Existing admin password reset successfully");
      console.log("Email:", user.email);
      process.exit(0);
    }

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ New admin created successfully");
    console.log("Email:", user.email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.log("❌ Admin setup error:", error.message);
    process.exit(1);
  }
};

createOrResetAdmin();