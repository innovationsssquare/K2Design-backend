const ProductSchema = new Schema({
    name: { type: String, required: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    price: { type: Number, required: true },
    sku: { type: String, unique: true },
    description: { type: String },
    images: [{ type: String }], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('Product', ProductSchema);
  