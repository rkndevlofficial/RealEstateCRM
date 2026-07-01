const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Lead = require("../models/Lead");
const ActivityLog = require("../models/ActivityLog");
const { protect } = require("../middleware/authMiddleware");

const createActivityLog = async ({
  req,
  action,
  module: logModule,
  message,
  targetId = null,
  targetName = "",
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      action,
      module: logModule,
      message,
      targetId,
      targetName,
      adminId: req.user?._id || req.user?.id || null,
      adminName: req.user?.name || "System",
      adminEmail: req.user?.email || "",
      ipAddress: req.ip || "",
      userAgent: req.get("user-agent") || "",
      metadata,
    });
  } catch (error) {
    console.log("Activity log error:", error.message);
  }
};

const getDigitsOnly = (value) => {
  return String(value || "").replace(/\D/g, "");
};

const isValidIndianPhone = (phone) => {
  const digits = getDigitsOnly(phone);

  if (digits.length === 10) return true;

  if (digits.length === 12 && digits.startsWith("91")) return true;

  return false;
};

const isValidEmail = (email) => {
  if (!email) return true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

const isPastDate = (date) => {
  if (!date) return false;

  const selectedDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
};

const validateLeadCreate = (data) => {
  if (!data.name || !data.name.trim()) {
    return "Name is required";
  }

  if (data.name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!data.phone || !data.phone.trim()) {
    return "Phone number is required";
  }

  if (!isValidIndianPhone(data.phone)) {
    return "Enter a valid 10 digit phone number";
  }

  if (data.email && !isValidEmail(data.email)) {
    return "Enter a valid email address";
  }

  if (data.message && data.message.length > 500) {
    return "Message should be less than 500 characters";
  }

  if (data.status && data.status.length > 50) {
    return "Invalid status value";
  }

  if (data.siteVisit) {
    if (data.status === "Site Visit") {
      if (!data.siteVisit.date) {
        return "Site visit date is required";
      }

      if (!data.siteVisit.time) {
        return "Site visit time is required";
      }
    }

    if (data.siteVisit.date && isPastDate(data.siteVisit.date)) {
      return "Site visit date cannot be in the past";
    }

    if (data.siteVisit.remarks && data.siteVisit.remarks.length > 500) {
      return "Site visit remarks should be less than 500 characters";
    }
  }

  if (data.followUp) {
    if (data.followUp.date && isPastDate(data.followUp.date)) {
      return "Follow-up date cannot be in the past";
    }

    if (data.followUp.remarks && data.followUp.remarks.length > 500) {
      return "Follow-up remarks should be less than 500 characters";
    }
  }

  return null;
};

const validateLeadUpdate = (data) => {
  if (data.name !== undefined) {
    if (!data.name.trim()) {
      return "Name cannot be empty";
    }

    if (data.name.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
  }

  if (data.phone !== undefined) {
    if (!data.phone.trim()) {
      return "Phone number cannot be empty";
    }

    if (!isValidIndianPhone(data.phone)) {
      return "Enter a valid 10 digit phone number";
    }
  }

  if (data.email !== undefined && data.email && !isValidEmail(data.email)) {
    return "Enter a valid email address";
  }

  if (data.message !== undefined && data.message.length > 500) {
    return "Message should be less than 500 characters";
  }

  if (data.status !== undefined && data.status.length > 50) {
    return "Invalid status value";
  }

  if (data.siteVisit) {
    if (data.siteVisit.date && isPastDate(data.siteVisit.date)) {
      return "Site visit date cannot be in the past";
    }

    if (data.siteVisit.remarks && data.siteVisit.remarks.length > 500) {
      return "Site visit remarks should be less than 500 characters";
    }
  }

  if (data.followUp) {
    if (data.followUp.date && !data.followUp.completed && isPastDate(data.followUp.date)) {
      return "Follow-up date cannot be in the past";
    }

    if (data.followUp.remarks && data.followUp.remarks.length > 500) {
      return "Follow-up remarks should be less than 500 characters";
    }
  }

  return null;
};

const cleanLeadPayload = (data) => {
  const payload = { ...data };

  if (payload.name !== undefined) payload.name = payload.name.trim();
  if (payload.phone !== undefined) payload.phone = payload.phone.trim();
  if (payload.email !== undefined) payload.email = payload.email.trim();
  if (payload.message !== undefined) payload.message = payload.message.trim();

  if (payload.projectName !== undefined) {
    payload.projectName = payload.projectName.trim();
  }

  if (payload.status !== undefined) payload.status = payload.status.trim();

  if (payload.siteVisit) {
    payload.siteVisit = {
      ...payload.siteVisit,
      date: payload.siteVisit.date || "",
      time: payload.siteVisit.time || "",
      remarks: payload.siteVisit.remarks?.trim() || "",
    };
  }

  if (payload.followUp) {
    payload.followUp = {
      ...payload.followUp,
      date: payload.followUp.date || "",
      time: payload.followUp.time || "",
      remarks: payload.followUp.remarks?.trim() || "",
      completed: Boolean(payload.followUp.completed),
      completedAt: payload.followUp.completed
        ? payload.followUp.completedAt || new Date()
        : undefined,
    };
  }

  return payload;
};

// Public route - users can submit leads
router.post("/", async (req, res) => {
  try {
    const validationError = validateLeadCreate(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const payload = cleanLeadPayload(req.body);

    const lead = await Lead.create(payload);

    await createActivityLog({
      req,
      action: "LEAD_CREATED",
      module: "Lead",
      message: `New lead received: ${lead.name}`,
      targetId: lead._id,
      targetName: lead.name,
      metadata: {
        phone: lead.phone,
        email: lead.email || "",
        projectName: lead.projectName || "",
        status: lead.status || "New",
      },
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route - only admin can view leads
router.get("/", protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route - only admin can update leads
router.put("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead id",
      });
    }

    const validationError = validateLeadUpdate(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const oldLead = await Lead.findById(req.params.id);

    if (!oldLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const payload = cleanLeadPayload(req.body);

    const lead = await Lead.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    const statusChanged =
      req.body.status !== undefined && oldLead.status !== lead.status;

    const followUpSet =
      req.body.followUp !== undefined &&
      req.body.followUp.date &&
      !req.body.followUp.completed;

    const followUpCompleted =
      req.body.followUp !== undefined && req.body.followUp.completed === true;

    let action = "LEAD_UPDATED";
    let message = `Lead updated: ${lead.name}`;

    if (statusChanged) {
      action = "LEAD_STATUS_CHANGED";
      message = `Lead status changed: ${lead.name} (${
        oldLead.status || "New"
      } → ${lead.status || "New"})`;
    }

    if (followUpSet) {
      action = "LEAD_FOLLOWUP_SET";
      message = `Follow-up set: ${lead.name} on ${lead.followUp?.date || ""} ${
        lead.followUp?.time || ""
      }`;
    }

    if (followUpCompleted) {
      action = "LEAD_FOLLOWUP_COMPLETED";
      message = `Follow-up completed: ${lead.name}`;
    }

    await createActivityLog({
      req,
      action,
      module: "Lead",
      message,
      targetId: lead._id,
      targetName: lead.name,
      metadata: {
        oldStatus: oldLead.status || "New",
        newStatus: lead.status || "New",
        projectName: lead.projectName || "",
        phone: lead.phone,
        followUp: lead.followUp || {},
      },
    });

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route - only admin can delete leads
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead id",
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    await createActivityLog({
      req,
      action: "LEAD_DELETED",
      module: "Lead",
      message: `Lead deleted: ${lead.name}`,
      targetId: lead._id,
      targetName: lead.name,
      metadata: {
        phone: lead.phone,
        email: lead.email || "",
        projectName: lead.projectName || "",
        status: lead.status || "New",
      },
    });

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;