// models/AcrylicLettersNumbers.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const acrylicLettersNumbersSchema = new mongoose.Schema(
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
        thickness: {
          type: String,
          required: true,
          enum: ["3mm", "4mm", "5mm","2mm"],
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

acrylicLettersNumbersSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("AcrylicLettersNumbers", acrylicLettersNumbersSchema);
