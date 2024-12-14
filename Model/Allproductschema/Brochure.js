const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const BrochureSchema = new Schema({
  name: { type: String, required: true },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
  price: { type: Number, required: true },
  sku: { type: String, unique: true },
  description: { type: String },
  images: [{ type: String }],
  slug: { type: String, unique: true },
 quantities: [
    {
      size: { type: String, required: true }, 
      paperType: { type: String, required: true },
      qty: { type: Number, required: true },
      costPerUnit: { type: Number, required: true }, 
      laminationCost: { type: Number, default: 0 },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BrochureSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Brochure", BrochureSchema);
