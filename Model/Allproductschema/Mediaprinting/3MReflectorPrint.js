const mongoose = require("mongoose");
const slugify = require("slugify");

const threeMReflectorSchema = new mongoose.Schema(
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
        type: {
          type: String,
          required: true,
          enum: ["3M Reflector + Transparent Film Print", "ACP 3mm"],
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
threeMReflectorSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("ThreeMReflectorPrint", threeMReflectorSchema);
