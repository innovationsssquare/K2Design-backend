const mongoose = require("mongoose");
const slugify = require("slugify");

const wallCalendarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    configurations: [
      {
        size: {
          type: String,
          required: true,
          enum: ["11.5 x 18", "10 x 15"], // Regular size and Small size
        },
        paperType: {
          type: String,
          required: true,
          enum: ["130gsm art paper", "80gsm maplito"],
        },
        sides: {
          type: String,
          required: true,
          enum: ["front back"], // Fixed value for this product
        },
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
              enum: [1000, 2000, 4000], // Fixed quantities
            },
            costPerUnit: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
wallCalendarSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("WallCalendar", wallCalendarSchema);
