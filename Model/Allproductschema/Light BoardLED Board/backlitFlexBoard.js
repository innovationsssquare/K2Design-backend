const mongoose = require("mongoose");
const slugify = require("slugify");

const backlitFlexBoardSchema = new mongoose.Schema(
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
    images: [{ type: String, required: true }],
    slug: {
      type: String,
      unique: true,
    },
    configurations: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "Backlit (Tube) Flex Board 1 side",
            "Backlit (Tube) Flex Board 2 side",
            "Lengthy Backlit (Tube) Flex Board 1 side",
          ],
        },
        sizeRange: [
          {
            startSqFt: { type: Number, required: true },
            endSqFt: { type: Number, required: true },
            baseRatePerSqFt: { type: Number, required: true },
            extraRate: { type: Number, required: true },
            finalSqFtRate: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Slug Middleware
backlitFlexBoardSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("BacklitFlexBoard", backlitFlexBoardSchema);
