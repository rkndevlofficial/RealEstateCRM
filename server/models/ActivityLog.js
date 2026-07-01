const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },

    module: {
      type: String,
      required: true,
      trim: true,
      enum: ["Project", "Lead", "Auth", "Admin"],
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    targetName: {
      type: String,
      default: "",
      trim: true,
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adminName: {
      type: String,
      default: "System",
      trim: true,
    },

    adminEmail: {
      type: String,
      default: "",
      trim: true,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ module: 1 });
activityLogSchema.index({ action: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);