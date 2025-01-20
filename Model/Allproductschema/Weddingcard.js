const mongoose = require("mongoose");
const slugify = require("slugify");

const weddingCardSchema = new mongoose.Schema(
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
        paperType: {
          type: String,
          required: true,
          enum: ["210 gsm art", "250 gsm art"],
        },
        sides: {
          type: Number,
          required: true,
          enum: [1, 2], // 1 for single-side, 2 for double-side printing
        },
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
            },
            baseRate: {
              type: Number,
              required: true,
            },
            laminationCost: {
              type: Number,
              default: 0,
            },
            envelopeCost: {
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

// Middleware to generate slug dynamically
weddingCardSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("WeddingCard", weddingCardSchema);
