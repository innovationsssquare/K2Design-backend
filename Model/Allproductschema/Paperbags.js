const mongoose = require("mongoose");
const slugify = require("slugify");

const paperBagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
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
    images: [
      {
        type: String,
        required: true,
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    configurations: [
      {
        size: {
          type: String,
          required: true,
        },
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
            },
            costPerUnit: {
              type: Number,
              required: true,
            },
            extraCosts: {
              spotandmattLamination: {
                type: Number,
                default: 0,
              },
              mattLamination: {
                type: Number,
                default: 0,
              },
              silverandgoldFoil: {
                type: Number,
                default: 0,
              },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
paperBagSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("PaperBag", paperBagSchema);
