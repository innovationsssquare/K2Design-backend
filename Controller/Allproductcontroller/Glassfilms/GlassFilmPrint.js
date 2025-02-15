const GlassFilmPrint = require("../../../Model/Allproductschema/Glassfilms/GlassFilmPrint");
const AppErr = require("../../../Services/AppErr");

// Create Glass Film Print
const CreateGlassFilmPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await GlassFilmPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newGlassFilmPrint = new GlassFilmPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newGlassFilmPrint.save();

    res.status(201).json({
      status: true,
      message: "Glass Film Print created successfully",
      data: newGlassFilmPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Glass Film Print Price
const CalculateGlassFilmPrintPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqft = height * width;

    // Find the product configuration
    const product = await GlassFilmPrint.findOne({
      "configurations.type": type,
    });

    if (!product) {
      return next(new AppErr("Glass Film Print with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    let totalPrice = 0;

    // If the product has a flat rate, apply it directly
    if (configuration.flatRate) {
      totalPrice = configuration.otherRate;
    } else {
      totalPrice = (configuration.baseRate + configuration.printingRate) * sqft;
    }

    res.status(200).json({
      status: true,
      data: { sqft, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Glass Film Prints
const GetAllGlassFilmPrints = async (req, res, next) => {
  try {
    const products = await GlassFilmPrint.find();
    res.status(200).json({ status: true, data: products });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Glass Film Print
const GetSingleGlassFilmPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await GlassFilmPrint.findById(id);

    if (!product) {
      return next(new AppErr("Glass Film Print not found", 404));
    }

    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateGlassFilmPrint,
  CalculateGlassFilmPrintPrice,
  GetAllGlassFilmPrints,
  GetSingleGlassFilmPrint,
};
