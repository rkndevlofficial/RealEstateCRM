const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      default: "Available",
    },

    floors: {
      type: Number,
      default: 0,
    },

    unitTypes: [
      {
        type: {
          type: String,
          default: "",
        },

        area: {
          type: Number,
          default: 0,
        },

        price: {
          type: Number,
          default: 0,
        },
      },
    ],

    highlights: {
      type: [String],
      default: [],
    },

    locationAdvantages: {
      type: [String],
      default: [],
    },

    brochure: {
      type: String,
      default: "",
    },

    mapLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);