const mongoose = require("mongoose");
const slugify = require("slugify");

const pamphletSchema = new mongoose.Schema(
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
          enum: [
            "A5 / 1/8",
            "A4 / 1/4",
            "A4 / 1/18",
            "A3 / 12x18",
            "A3 / 18x23",
            "A2 / 18x23",
            "7 x 10",
            "10 x 15",
            "15 x 20",
            "20 x 30",
          ],
        },
        paperType: {
          type: String,
          required: true,
          enum: ["130 gsm", "70 gsm"],
        },
        printingType: {
          type: String,
          required: true,
          enum: ["Onecolour", "Multicolor"], // Added printing type
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
            twosidecost: {
              type: Number,
              default: 0,
            },
            cuttingOptionCost: {
              type: Number,
              default: 0, // Additional cost for cutting (Flash or Extra Border)
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
pamphletSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Pamphlet", pamphletSchema);
