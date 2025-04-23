const mongoose = require("mongoose");
const slugify = require("slugify");

const lightboxBoardSchema = new mongoose.Schema(
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
          enum: [
            "Backlit Flex + LED Module 3'' Depth",
            "Acrylic + Vinyl cut letter + LED Module 3''depth board",
            "Acrylic + Acrylic cut letter + LED Module 3''depth board",
            "Backlit flex + LED Strip 3''depth board"
          ],
        },
        sizeRange: [
          {
            startSqFt: { type: Number, required: true },
            endSqFt: { type: Number, required: true },
            actualRatePerSqFt: { type: Number, required: true },
            extraDiscount: { type: Number, required: true },
            finalSqFtRate: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

lightboxBoardSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("LightboxBoard", lightboxBoardSchema);
 