const mongoose = require("mongoose");
const slugify = require("slugify");

const tableStandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    images: [{ type: String, required: true }],
    slug: { type: String, unique: true },
    configurations: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "Flat Table Stand - 31mm",
            "Flat Table Stand - 62mm",
            "Flat Table Stand - 31mm Slider",
            "Flat Table Stand - 62mm Slider",
            "Curv Table Stand - 78mm",
            "Curv Table Stand - 109mm"
          ],
        },
        frameSizes: [
          {
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

tableStandSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("TableStand", tableStandSchema);
