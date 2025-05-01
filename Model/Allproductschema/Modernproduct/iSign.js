const mongoose = require("mongoose");
const slugify = require("slugify");

const iSignWallMountedSchema = new mongoose.Schema(
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
        type: {
          type: String,
          required: true,
          enum: ["Silver Anodised", "Black Anodised", "Bronze Anodised"],
        },
        sizeRange: [
          {
            startSqInch: { type: Number, required: true },
            endSqInch: { type: Number, required: true },
            actualRatePerSqInch: { type: Number, required: true },
            extraDiscount: { type: Number, required: true },
            finalSqInchRate: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

iSignWallMountedSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("ISignWallMounted", iSignWallMountedSchema);
