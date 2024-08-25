const SubcategorySchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);
