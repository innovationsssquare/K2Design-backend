const mongoose = require("mongoose");
const slugify = require("slugify");

const stampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "Basic - Nylon Stamp", "Sun Stamp", "Dater Stamp"
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
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
        Stampname: {
          type: String,
          required: true, // Example: "Rectangular", "Oval", "Square", etc.
          trim: true,
        },
        type: {
          type: String,
          required: true, // Example: "Rectangular", "Oval", "Square", etc.
          trim: true,
        },
        lineRates: [
          {
            lines: {
              type: Number, // Example: 1, 2, 3, or 4 lines
              required: false,
            },
            rate: {
              type: Number, // Cost per line
              required: false,
            },
          },
        ],
        fixedRate: {
          type: Number, // Cost for non-line-based configurations like Oval/Round
          default: null,
        },
        inkColors: [
          {
            type: String,
            enum: ["Violet", "Red", "Black", "Cyan"], // Allowed ink colors
          },
        ],
        quantities: [
          {
            qty: {
              type: Number,
              required: true, // Example: 1, 10, 50, 100
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
stampSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Stamp", stampSchema);
