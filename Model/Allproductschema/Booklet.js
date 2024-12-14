const mongoose = require("mongoose");
const slugify = require("slugify");

const bookletSchema = new mongoose.Schema(
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
    price: {
      type: Number,
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
    slug: { type: String, unique: true },
    configurations: [
      {
        size: {
          type: String, 
          required: true,
        },
        pageType: {
          type: String,
          required: true,
        },
        paperType: {
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
            laminationCost: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);


bookletSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Booklet", bookletSchema);
