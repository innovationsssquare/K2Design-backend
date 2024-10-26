const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

// Define a schema for product variants
const VariantSchema = new Schema({
  variantName: { type: String}, // e.g., "Size" or "Color"
  variantValue: { type: String }, // e.g., "Small", "Large", "Red", "Blue"
  additionalPrice: { type: Number, default: 0 }, // Any price adjustment for this variant
});


const customizationOptionSchema = new mongoose.Schema({
  fieldName: { type: String, required: true }, // e.g., 'Material', 'Lamination'
  fieldType: { type: String, required: true }, // e.g., 'dropdown', 'radio', 'text'
  options: [{
    label: String,  // e.g., '1 side', '2 side', 'Gloss-Front'
    rate: Number    // e.g., 0.6, 0.3, 0.1 (optional for non-rate fields)
  }]  // Array of options (with rates for dropdown, radio, etc.), can be empty for text fields
});


// Product schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }, 
  price: { type: Number, required: true },
  sku: { type: String, unique: true },
  description: { type: String },
  images: [{ type: String }], 
  slug: { type: String, unique: true }, 
  customizations: [customizationOptionSchema],
  variants: [VariantSchema], // Array of product variants
  availableQuantities: [Number], // Added for flexible qty options like [200, 300, 400, 500]
  qty: { type: Number, required: true },  // This stores the selected quantity
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate slug before saving
ProductSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
