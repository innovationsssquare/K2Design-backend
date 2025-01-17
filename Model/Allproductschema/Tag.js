const mongoose = require("mongoose");
const slugify = require("slugify");

const tagSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
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
        paperType: {
          type: String,
          required: true,
        },
        sideRates: {
          oneSide: {
            type: Number,
            required: true,
          },
          twoSide: {
            type: Number,
            required: true,
          },
        },
        laminationRates: {
          glossFront: {
            type: Number,
            default: 0,
          },
          glossBack: {
            type: Number,
            default: 0,
          },
        },
        uvRates: {
          uvFront: {
            type: Number,
            default: 0,
          },
          uvBack: {
            type: Number,
            default: 0,
          },
        },
        extraOptions: {
          stringWithHole: {
            type: Boolean,
            default: false,
          },
          perforation: {
            type: Boolean,
            default: false,
          },
        },
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
            },
            costPerUnit: {
              type: Number,
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
tagSchema.pre("save", function (next) {
  if (this.product && !this.slug) {
    this.slug = slugify(this.product, { lower: true });
  }
  next();
});

module.exports = mongoose.model("Tag", tagSchema);
