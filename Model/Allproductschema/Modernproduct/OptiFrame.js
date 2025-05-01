const mongoose = require("mongoose");
const slugify = require("slugify");

const optiFrameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sku: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    images: [{ type: String, required: true }],
    slug: { type: String, unique: true },
    configurations: [
      {
        type: {
          type: String,
          required: true,
          enum: ["Silver Anodised", "Black Powder Coated", "Wood Effect"],
        },
        frameSizes: [
          {
            frameLabel: { type: String, required: true },
            widthMM: { type: Number, required: true },
            heightMM: { type: Number, required: true },
            customerCostWithPrint: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

optiFrameSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("OptiFrame", optiFrameSchema);
