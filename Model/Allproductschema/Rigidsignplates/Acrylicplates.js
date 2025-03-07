const mongoose = require("mongoose");
const slugify = require("slugify");

const AcrylicPlateSchema = new mongoose.Schema(
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
        plateType: {
          type: String,
          required: true,
          enum: ["Acrylic 4mm + Vinyl Letter", "Acrylic 4mm + Golden Vinyl Letter", "Acrylic Letter 2mm + Acrylic back 4mm","Acrylic Letter 2mm + ACP 3mm"],
        },
        thickness: {
          type: String,
          required: true,
        },
        rates: [
          {
            sizeRange: {
              start: { type: Number, required: true },
              end: { type: Number, required: true },
            },
            actualRate: { type: Number, required: true },
            extraRate: { type: Number, required: true },
            finalRate: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
AcrylicPlateSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("AcrylicPlate", AcrylicPlateSchema);
