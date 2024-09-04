const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const SubcategorySchema = new Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  description: { type: String },
  slug: { type: String, unique: true },
  image: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SubcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);
