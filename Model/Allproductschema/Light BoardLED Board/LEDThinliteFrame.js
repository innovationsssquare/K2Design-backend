const mongoose = require("mongoose");
const slugify = require("slugify");

const ledThinliteFrameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [{ type: String, required: true }],
    slug: {
      type: String,
      unique: true,
    },
    configurations: [
      {
        type: {
          type: String,
          required: true,
          enum: ["Silver Anodised", "Black Anodised"],
        },
        sizeRange: [
          {
            startSqFt: { type: Number, required: true },
            endSqFt: { type: Number, required: true },
            frameRatePerSqFt: { type: Number, required: true },
            printRatePerSqFt: { type: Number, required: true },   
            totalRatePerSqFt: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

ledThinliteFrameSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("LEDThinliteFrame", ledThinliteFrameSchema);
