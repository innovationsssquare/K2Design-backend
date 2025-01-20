const mongoose = require("mongoose");
const slugify = require("slugify");

const pavatiBookSchema = new mongoose.Schema(
  {
    product: {
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
        type: {
          type: String,
          enum: ["Multi Colour", "One Colour"],
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        pages: {
          type: Number,
          enum: [50, 100],
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
          },
        ],
        printSide: {
          type: Number,
          default: 1,
        },
        pageNumbering: {
          type: String,
          enum: ["Manual Typing", "None"],
          default: "None",
        },
        bookNumbering: {
          type: String,
          enum: ["Manual Typing", "None"],
          default: "None",
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
pavatiBookSchema.pre("validate", function (next) {
  if (this.product && !this.slug) {
    this.slug = slugify(this.product, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("PavatiBook", pavatiBookSchema);
