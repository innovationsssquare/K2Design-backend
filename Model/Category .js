const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  slug: {
    type: String,
    unique: true,
  },
  image: {
    type: String,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      productType: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
