const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Project = require("../models/Project");
const ActivityLog = require("../models/ActivityLog");
const { protect } = require("../middleware/authMiddleware");

const validStatuses = ["Available", "Sold", "Upcoming"];

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
      adminName: req.user?.name || "Admin",
      adminEmail: req.user?.email || "",
      ipAddress: req.ip || "",
      userAgent: req.get("user-agent") || "",
      metadata,
    });
  } catch (error) {
    console.log("Activity log error:", error.message);
  }
};

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const cleanTextArray = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => String(item || "").trim())
    .filter((item) => item !== "")
    .slice(0, 20);
};

const cleanImageArray = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => String(item || "").trim())
    .filter((item) => item !== "")
    .slice(0, 20);
};

const cleanUnitTypes = (unitTypes) => {
  if (!Array.isArray(unitTypes)) return [];

  return unitTypes
    .filter(
      (unit) =>
        unit?.type?.trim() ||
        String(unit?.area || "").trim() ||
        String(unit?.price || "").trim()
    )
    .map((unit) => ({
      type: unit.type?.trim() || "",
      area: Number(unit.area) || 0,
      price: Number(unit.price) || 0,
    }))
    .slice(0, 20);
};

const validateUnitTypes = (unitTypes) => {
  if (!unitTypes) return null;

  if (!Array.isArray(unitTypes)) {
    return "Unit types must be an array";
  }

  if (unitTypes.length > 20) {
    return "Maximum 20 unit types allowed";
  }

  const filledUnits = unitTypes.filter(
    (unit) =>
      unit?.type?.trim() ||
      String(unit?.area || "").trim() ||
      String(unit?.price || "").trim()
  );

  for (let i = 0; i < filledUnits.length; i++) {
    const unit = filledUnits[i];

    if (!unit.type || !unit.type.trim()) {
      return `Unit type ${i + 1}: Type is required`;
    }

    if (unit.type.trim().length > 50) {
      return `Unit type ${i + 1}: Type should be less than 50 characters`;
    }

    if (unit.area && Number(unit.area) < 0) {
      return `Unit type ${i + 1}: Area cannot be negative`;
    }

    if (unit.price && Number(unit.price) < 0) {
      return `Unit type ${i + 1}: Price cannot be negative`;
    }
  }

  return null;
};

const validateProjectPayload = (data, isUpdate = false) => {
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || !data.name.trim()) {
      return "Project name is required";
    }

    if (data.name.trim().length < 2) {
      return "Project name must be at least 2 characters";
    }

    if (data.name.trim().length > 100) {
      return "Project name should be less than 100 characters";
    }
  }

  if (!isUpdate || data.location !== undefined) {
    if (!data.location || !data.location.trim()) {
      return "Project location is required";
    }

    if (data.location.trim().length < 2) {
      return "Project location must be at least 2 characters";
    }

    if (data.location.trim().length > 150) {
      return "Project location should be less than 150 characters";
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (data.price === "" || data.price === undefined || data.price === null) {
      return "Project price is required";
    }

    if (Number(data.price) <= 0) {
      return "Enter a valid project price";
    }
  }

  if (data.description && data.description.length > 2000) {
    return "Description should be less than 2000 characters";
  }

  if (data.status && !validStatuses.includes(data.status)) {
    return "Invalid project status";
  }

  if (data.floors !== undefined && data.floors !== "") {
    if (Number(data.floors) < 0) {
      return "Floors cannot be negative";
    }
  }

  if (data.image && !isValidUrl(data.image)) {
    return "Enter a valid cover image URL";
  }

  if (data.brochure && !isValidUrl(data.brochure)) {
    return "Enter a valid brochure URL";
  }

  if (data.mapLink && !isValidUrl(data.mapLink)) {
    return "Enter a valid map URL";
  }

  if (data.images !== undefined) {
    if (!Array.isArray(data.images)) {
      return "Gallery images must be an array";
    }

    if (data.images.length > 20) {
      return "Maximum 20 gallery images allowed";
    }

    const invalidImage = data.images.find(
      (img) => img && !isValidUrl(String(img).trim())
    );

    if (invalidImage) {
      return "Enter valid gallery image URLs";
    }
  }

  if (data.highlights !== undefined) {
    if (!Array.isArray(data.highlights)) {
      return "Highlights must be an array";
    }

    if (data.highlights.length > 20) {
      return "Maximum 20 highlights allowed";
    }

    const longHighlight = data.highlights.find(
      (item) => String(item || "").trim().length > 150
    );

    if (longHighlight) {
      return "Each highlight should be less than 150 characters";
    }
  }

  if (data.locationAdvantages !== undefined) {
    if (!Array.isArray(data.locationAdvantages)) {
      return "Location advantages must be an array";
    }

    if (data.locationAdvantages.length > 20) {
      return "Maximum 20 location advantages allowed";
    }

    const longAdvantage = data.locationAdvantages.find(
      (item) => String(item || "").trim().length > 150
    );

    if (longAdvantage) {
      return "Each location advantage should be less than 150 characters";
    }
  }

  const unitError = validateUnitTypes(data.unitTypes);

  if (unitError) {
    return unitError;
  }

  return null;
};

const cleanProjectPayload = (data) => {
  const payload = {};

  if (data.name !== undefined) payload.name = data.name.trim();
  if (data.location !== undefined) payload.location = data.location.trim();
  if (data.price !== undefined) payload.price = Number(data.price);

  if (data.description !== undefined) {
    payload.description = data.description.trim();
  }

  if (data.image !== undefined) payload.image = data.image.trim();
  if (data.status !== undefined) payload.status = data.status;
  if (data.floors !== undefined) payload.floors = Number(data.floors) || 0;

  if (data.unitTypes !== undefined) {
    payload.unitTypes = cleanUnitTypes(data.unitTypes);
  }

  if (data.images !== undefined) {
    payload.images = cleanImageArray(data.images);
  }

  if (data.highlights !== undefined) {
    payload.highlights = cleanTextArray(data.highlights);
  }

  if (data.locationAdvantages !== undefined) {
    payload.locationAdvantages = cleanTextArray(data.locationAdvantages);
  }

  if (data.brochure !== undefined) payload.brochure = data.brochure.trim();
  if (data.mapLink !== undefined) payload.mapLink = data.mapLink.trim();

  return payload;
};

// Public route
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Public route
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route
router.post("/", protect, async (req, res) => {
  try {
    const validationError = validateProjectPayload(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const payload = cleanProjectPayload(req.body);

    const project = await Project.create(payload);

    await createActivityLog({
      req,
      action: "PROJECT_CREATED",
      module: "Project",
      message: `Project added: ${project.name}`,
      targetId: project._id,
      targetName: project.name,
      metadata: {
        location: project.location,
        status: project.status,
        price: project.price,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route
router.put("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
    }

    const validationError = validateProjectPayload(req.body, true);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const oldProject = await Project.findById(req.params.id);

    if (!oldProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const payload = cleanProjectPayload(req.body);

    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    await createActivityLog({
      req,
      action: "PROJECT_UPDATED",
      module: "Project",
      message: `Project updated: ${project.name}`,
      targetId: project._id,
      targetName: project.name,
      metadata: {
        oldStatus: oldProject.status,
        newStatus: project.status,
        oldPrice: oldProject.price,
        newPrice: project.price,
      },
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin protected route
router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    await createActivityLog({
      req,
      action: "PROJECT_DELETED",
      module: "Project",
      message: `Project deleted: ${project.name}`,
      targetId: project._id,
      targetName: project.name,
      metadata: {
        location: project.location,
        status: project.status,
        price: project.price,
      },
    });

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;