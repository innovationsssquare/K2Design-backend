const mongoose = require("mongoose");
const slugify = require("slugify");

const vinylPrintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "Vinyl Print (Premium) Eco-solvent"
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
        type: {
          type: String,
          required: true,
          enum: ["Vinyl Print (Premium) Eco-solvent", "Vinyl Print Economy"],
        },
        rigidSurface: {
          type: String,
          required: true,
          enum: ["Foamsheet3mm", "Foamsheet5mm","ACP3mm","Vinyl Print"],
        },
        sizeRange: [
          {
            startSqFt: {
              type: Number,
              required: true,
            },
            endSqFt: {
              type: Number,
              required: true,
            },
            baseRate: {
              type: Number,
              required: true,
            },
            extraRate: {
              type: Number,
              required: true, // 10% extra added
            },
            finalRate: {
              type: Number,
              required: true, // baseRate + extraRate
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
vinylPrintSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("VinylPrint", vinylPrintSchema);
