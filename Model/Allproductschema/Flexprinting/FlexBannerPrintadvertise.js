const mongoose = require("mongoose");
const slugify = require("slugify");

const flexBannerPrintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "Flex Advertise + MS Frame"
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
        type: {
          type: String,
          required: true,
          enum: ["Flex Advertise + MS Frame"],
        },
        sizeRange: [
          {
            startSqFt: {
              type: Number,
              required: true,
            },
            endSqFt: {
              type: Number,
              required: true,
            },
            baseRate: {
              type: Number,
              required: true,
            },
            extraRate: {
              type: Number,
              required: true,
            },
            finalRate: {
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
flexBannerPrintSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("FlexBannerPrint", flexBannerPrintSchema);
