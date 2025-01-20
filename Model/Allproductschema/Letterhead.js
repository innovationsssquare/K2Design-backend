const mongoose = require("mongoose");
const slugify = require("slugify"); // For generating slugs dynamically

const LetterheadsSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Letterheads",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Image URLs or file paths
      required: true,
    },
  ],
  slug: {
    type: String,
    required: true,
    unique: true, // Ensures the slug is unique across products
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  paperType: {
    type: String,
    required: true,
    enum: ["100gsm Bond", "Maplitho Paper"],
  },
  size: {
    type: String,
    required: true,
    enum: ["A4"],
  },
  printingType: {
    type: String,
    required: true,
    enum: ["Multicolour"],
  },
  printSide: {
    type: String,
    required: true,
    enum: ["1 side"],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  configurations: [
    {
      quantity: { type: Number, required: true },
      perRate: { type: Number, required: true },
      bindingCosts: {
        binding100Sheets: { type: Number, default: 0 },
        binding50Sheets: { type: Number, default: 0 },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate slug dynamically
LetterheadsSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Letterheads", LetterheadsSchema);
