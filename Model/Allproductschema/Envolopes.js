const mongoose = require("mongoose");
const slugify = require("slugify");

const envelopeSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Envelopes", required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    images: [{ type: String, required: true }], // URLs for product images
    slug: { type: String, unique: true },

    configurations: [
      {
        size: {
          type: String,
          required: true,
          enum: ["9x4", "7x5", "6x9", "A4","6x4"], // Envelope sizes
        },
        printingType: {
          type: String,
          required: true,
          enum: ["Multicolour", "One Colour"], // Printing type
        },
        paperType: {
          type: String,
          required: true,
          enum: ["100gsm Bond/Sunshine", "130gsm Art Paper", "70gsm Maplitho"], // Paper types
        },
        quantityOptions: [
          {
            quantity: { type: Number, required: true }, // Fixed quantity options
            costPerUnit: { type: Number, required: true }, // Cost per envelope
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Automatically generate a slug from the name
envelopeSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Envelope", envelopeSchema);
