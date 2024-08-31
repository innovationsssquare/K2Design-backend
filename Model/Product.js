const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const ProductSchema = new Schema({
  name: { type: String, required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }, 
  price: { type: Number, required: true },
  sku: { type: String, unique: true },
  description: { type: String },
  images: [{ type: String }], 
  slug: { type: String, unique: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate slug before saving
ProductSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
