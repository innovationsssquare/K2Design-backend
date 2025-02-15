const mongoose = require("mongoose");
const slugify = require("slugify");

const glassFilmPrintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Example: "Film-Transparent-Gloss", "Frosted Film-White crystal"
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
          enum: [
            "Film-Transparent-Gloss",
            "Film-Transparent-Matt",
            "Film-Transparent-Gloss 3M",
            "Film-Transparent-Matt 3M",
            "Frosted Film-White crystal",
            "Frosted Film-White 3M",
            "Frosted Film-White-LG Hausys",
            "Frosted Film-Semi Transparent LG Hausys",
            "Frosted Film-Silver LG Hausys",
            "Frosted Film-Texture LG Hausys",
            "Frosted Film-Sparkle LG Hausys",
            "Black Suncontrol film-Garware",
            "Black Suncontrol film-Anti Scrach-Garware",
            "Decorative film for window & glass door",
          ],
        },
        baseRate: {
          type: Number,
          required: true,
        },
        printingRate: {
          type: Number,
          required: true,
        },
        otherRate: {
          type: Number,
          required: true,
        },
        flatRate: {
          type: Boolean,
          default: false, // If true, apply flat rate directly
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate slug dynamically
glassFilmPrintSchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("GlassFilmPrint", glassFilmPrintSchema);
