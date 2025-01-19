const mongoose = require("mongoose");
const slugify = require("slugify");

const invitationCardSchema = new mongoose.Schema(
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
          enum: ["6x4", "7x5", "6x9"], // Available sizes
        },
        quantities: [
          {
            qty: {
              type: Number,
              required: true,
              enum: [100, 200, 300, 500, 1000, 2000], // Quantities
            },
            costPerUnit: {
              type: Number,
              required: true,
            },
            laminationcost: {
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
invitationCardSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("InvitationCard", invitationCardSchema);
