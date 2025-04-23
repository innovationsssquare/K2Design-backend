const mongoose = require("mongoose");
const slugify = require("slugify");

const ledLettersSchema = new mongoose.Schema(
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
            "Acrylic 3D Letters - MARATHI",
            "Acrylic 3D Letters - English",
            "Aluminium 3D Channel Letters",
            "MS 3D Letters",
            "SS 3D Letters",
            "GOLD 3D Letters",
            "ROSE GOLD 3D Letters",
          ],
        },
        sizeRange: [
          {
            startInch: { type: Number, required: true },
            endInch: { type: Number, required: true },
            actualRatePerInch: { type: Number, required: true },
            ledModuleCost: { type: Number, required: true },
            customerCostPerInch: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Slug Middleware
ledLettersSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("LEDLetters", ledLettersSchema);
