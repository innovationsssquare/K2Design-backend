const TranslitPrint = require("../../../Model/Allproductschema/Mediaprinting/TranslitPrint");
const { validationResult } = require("express-validator");
const AppErr = require("../../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Translit Print
const CreateTranslitPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await TranslitPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newTranslitPrint = new TranslitPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newTranslitPrint.save();

    res.status(201).json({
      status: true,
      message: "Translit Print created successfully",
      data: newTranslitPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Translit Print Price
const CalculateTranslitPrintPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { type, height, width } = req.body;

    // Calculate square feet
    const sqft = height * width;

    // Find the correct configuration
    const translitPrint = await TranslitPrint.findOne({
      "configurations.type": type,
    });

    if (!translitPrint) {
      return next(new AppErr("Translit Print with specified type not found", 404));
    }

    const configuration = translitPrint.configurations.find(
      (config) => config.type === type
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    // Find the matching size range
    const sizeOption = configuration.sizeRange.find(
      (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    // Calculate total price
    const totalPrice = sizeOption.finalRate * sqft;

    res.status(200).json({
      status: true,
      data: { sqft, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateTranslitPrint,
  CalculateTranslitPrintPrice,
  GetAllTranslitPrints: async (req, res, next) => {
    try {
      const translitPrints = await TranslitPrint.find();
      res.status(200).json({ status: true, data: translitPrints });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  },
  GetSingleTranslitPrint: async (req, res, next) => {
    try {
      const { id } = req.params;
      const translitPrint = await TranslitPrint.findById(id);
      if (!translitPrint) {
        return next(new AppErr("Translit Print not found", 404));
      }
      res.status(200).json({ status: true, data: translitPrint });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  },

};
