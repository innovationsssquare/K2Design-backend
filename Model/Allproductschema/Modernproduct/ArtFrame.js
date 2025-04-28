const mongoose = require("mongoose");
const slugify = require("slugify");

const artFrameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sku: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    images: [{ type: String, required: true }],
    slug: { type: String, unique: true },
    configurations: [
      {
        mainType: {
          type: String,
          required: true,
          enum: [
            "Steller - 50 mm Depth",
            "Lunar - 50 mm Depth",
            "Terra - 50 mm Depth",
          ],
        },
        subType: {
          type: String,
          enum: [
            "Silver Anodized",
            "Black Anodized",
            "Bronze Anodized",
          ],
          default: null, 
        },
        sizeRange: [
          {
            startSqInch: { type: Number, required: true },
            endSqInch: { type: Number, required: true },
            finalSqInchRate: { type: Number, required: true },
            premiumVinylFoam5mm: { type: Number, required: true },
            canvasFoam5mm: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

artFrameSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("ArtFrame", artFrameSchema);
