const mongoose = require("mongoose");
const slugify = require("slugify");

const filesAndFoldersSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Files and Folders", trim: true },
    sku: { type: String, required: true, unique: true }, // Unique SKU for product
    description: { type: String, trim: true },
    images: [{ type: String, required: true }],
    slug: { type: String, unique: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    configurations: [
      {
        productType: {
          type: String,
          required: true,
          enum: ["Premium Board Files", "Paper Files", "Plastic Files"],
        },
        paperType: {
          type: String,
          enum: ["250gsm", "320gsm", "PP 0.3mm Plastic"],
        },
        size: {
          type: String,
          required: true,
          enum: ["9x12 Inches"],
        },
        quantityOptions: [
          {
            quantity: { type: Number, required: true }, // Fixed quantity options
            costPerUnit: { type: Number, required: true },
            extraCosts: {
              glossLamination: { type: Number, default: 0 },
              mattLamination: { type: Number, default: 0 },
              mattSpotUV: { type: Number, default: 0 },
              innerSideCost: { type: Number, default: 0 },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Automatically generate a slug from the name
filesAndFoldersSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("FilesAndFolders", filesAndFoldersSchema);
