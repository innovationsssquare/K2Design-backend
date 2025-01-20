const mongoose = require("mongoose");
const slugify = require("slugify");

const billBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "1/16 W+NP"
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
          required: true,
          enum: ["One Colour", "Multi Colour"], // Printing type
        },
        size: {
          type: String,
          required: true,
          enum: ["1/16", "1/8", "1/6", "1/5", "1/4"], // Based on the PDF
        },
        pageDetails: {
          type: String,
          required: true,
          enum: ["W+NP", "W+P+Y"], // Page types
        },
        bindingType: {
          type: String,
          required: true,
          enum: ["Cover", "Double"], // Binding type
        },
        pageCount: {
          type: Number,
          required: true,
          enum: [50, 100], // Page count
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
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
billBookSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("BillBook", billBookSchema);
