const mongoose = require("mongoose");
const slugify = require("slugify");

const PvcfoamPlateSchema = new mongoose.Schema(
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
          enum: ["Vinyl Print + PVC Foam", "Ecosolvent Print + PVC Foam", "Vinyl Cutting (1 Colour ) + PVC Foam","Vinyl Cutting (2 Colour ) + PVC Foam"],
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
PvcfoamPlateSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("PvcfoamPlate", PvcfoamPlateSchema);
