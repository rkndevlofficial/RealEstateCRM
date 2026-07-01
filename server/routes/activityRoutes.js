const express = require("express");
const router = express.Router();

const ActivityLog = require("../models/ActivityLog");
const { protect } = require("../middleware/authMiddleware");

const allowedModules = ["Project", "Lead", "Auth", "Admin"];

router.get("/", protect, async (req, res) => {
  try {
    const query = {};

    const moduleFilter = String(req.query.module || "").trim();
    const actionFilter = String(req.query.action || "").trim();

    if (
      moduleFilter &&
      moduleFilter !== "All" &&
      allowedModules.includes(moduleFilter)
    ) {
      query.module = moduleFilter;
    }

    if (actionFilter && actionFilter !== "All") {
      query.action = actionFilter;
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    console.log("Activity logs fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch activity logs",
    });
  }
});

module.exports = router;