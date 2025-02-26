const mongoose = require("mongoose");
const slugify = require("slugify");

const flexWoodenFrameSchema = new mongoose.Schema(
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
        },
        sqFt: {
          type: Number,
          required: true,
        },
        economyRate: {
          type: Number,
          required: true,
        },
        premiumRate: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
flexWoodenFrameSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("FlexWoodenFrame", flexWoodenFrameSchema);
