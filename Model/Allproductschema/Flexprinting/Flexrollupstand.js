const mongoose = require("mongoose");
const slugify = require("slugify");

const rollUpStandeeSchema = new mongoose.Schema(
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
          enum: ["6x3"],
        },
        pricing: {
          standeePrice: {
            type: Number,
            required: true,
          },
          economyFlexPrice: {
            type: Number,
            required: true,
          },
          premiumFlexPrice: {
            type: Number,
            required: true,
          },
          hpLatexPremiumFlexPrice: {
            type: Number,
            required: true,
          },
        },
        discountStructure: [
          {
            minQty: {
              type: Number,
              required: true,
            },
            maxQty: {
              type: Number,
              required: true,
            },
            discountPercentage: {
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
rollUpStandeeSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("RollUpStandee", rollUpStandeeSchema);
