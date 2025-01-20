const mongoose = require("mongoose");
const slugify = require("slugify");

const visitingCardSchema = new mongoose.Schema(
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
    price: {
      type: Number,
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
        material: {
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

visitingCardSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("VisitingCard", visitingCardSchema);
