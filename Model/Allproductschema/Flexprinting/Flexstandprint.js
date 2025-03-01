const mongoose = require("mongoose");
const slugify = require("slugify");

const flexStandSchema = new mongoose.Schema(
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
        standType: {
          type: String,
          required: true,
          enum: ["Simple Stand", "Folding Stand"],
        },
        frameRates: [
          {
            frameSize: {
              type: String,
              required: true,
            },
            msTubeRates: {
              threeFourInchRate: {
                type: Number,
                required: true,
              },
              oneInchRate: {
                type: Number,
                required: true,
              },
            },
            economyFlexRates: {
              oneSideRate: {
                type: Number,
                required: true,
              },
              twoSideRate: {
                type: Number,
                required: true,
              },
            },
            premiumFlexRates: {
              oneSideRate: {
                type: Number,
                required: true,
              },
              twoSideRate: {
                type: Number,
                required: true,
              },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
flexStandSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("FlexStand", flexStandSchema);
