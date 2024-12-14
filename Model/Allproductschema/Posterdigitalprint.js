const mongoose = require("mongoose");
const slugify = require("slugify");

const printSchema = new mongoose.Schema(
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
    slug: { type: String, unique: true },

    configurations: [
      {
        size: {
          type: String,
          required: true,
          enum: ["12x18", "A4"], 
        },
        printingSide: {
          type: String,
          required: true,
          enum: ["1 side", "2 side"], 
        },
        paperTypes: [
          {
            type: {
              type: String,
              required: true,
              enum: ["250gsm", "170gsm", "100gsm", "Metallic", "Texture"], // Paper types
            },
            costConfigurations: [
              {
                quantityRange: {
                  type: String,
                  required: true,
                  enum: [
                    "1-5",
                    "6-20",
                    "1-15",
                    "6-20",
                    "16-20",
                    "21-50",
                    "51-100",
                    "101-300",
                    "301-500",
                    "501-1000",
                  ], 
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
    ],
  },
  { timestamps: true }
);

printSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("PrintProduct", printSchema);
