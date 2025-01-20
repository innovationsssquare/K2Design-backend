const mongoose = require("mongoose");
const slugify = require("slugify");

const stickerLabelSchema = new mongoose.Schema(
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
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
            },
            unitRate: {
              type: Number,
              required: true,
            },
            laminationCost: {
              type: Number,
              required: true,
              default: 0,
            },
          },
        ],
      },
    ],
    customizations: [
      {
        size: {
          type: String,
          required: true,
        },
        quantities: [
          {
            minQty: {
              type: Number,
              required: true,
            },
            maxQty: {
              type: Number,
              required: true,
            },
            unitRate: {
              type: Number,
              required: true,
            },
            laminationCost: {
              type: Number,
              required: true,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
stickerLabelSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("StickerLabel", stickerLabelSchema);
