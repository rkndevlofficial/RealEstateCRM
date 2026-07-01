const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    message: {
      type: String,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    projectName: {
      type: String,
    },

    status: {
      type: String,
      default: "New",
    },

    siteVisit: {
      date: {
        type: String,
      },
      time: {
        type: String,
      },
      remarks: {
        type: String,
      },
    },

    followUp: {
      date: {
        type: String,
      },
      time: {
        type: String,
      },
      remarks: {
        type: String,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: {
        type: Date,
      },
    },

    notes: [
      {
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);