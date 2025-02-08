const NightGlowPrint = require("../../../Model/Allproductschema/Mediaprinting/Nightglow");
const AppErr = require("../../../Services/AppErr");

// Create Night Glow Print
const CreateNightGlowPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await NightGlowPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new NightGlowPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Night Glow Print created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
const CalculateNightGlowPrintPrice = async (req, res, next) => {
  try {
    const { rigidSurface, width, height, lamination } = req.body;
    
    // Calculate total area
    const totalSqFt = width * height;
    
    // Find the rate for the given range
    const product = await NightGlowPrint.findOne({
      "configurations.rigidSurface": rigidSurface,
    });

    if (!product) {
      return next(new AppErr("Configuration not found", 404));
    }

    const configuration = product.configurations.find(
      (config) => config.rigidSurface === rigidSurface
    );

    if (!configuration) {
      return next(new AppErr("Configuration for rigid surface not found", 404));
    }

    const sizeRangeOption = configuration.sizeRange.find(
      (range) => totalSqFt >= range.startSqFt && totalSqFt <= range.endSqFt
    );

    if (!sizeRangeOption) {
      return next(new AppErr("Size range not found", 400));
    }

    // Calculate total price
    let totalPrice = totalSqFt * sizeRangeOption.finalRate;

    // Add lamination if applied
    if (lamination) {
      totalPrice += totalSqFt * configuration.laminationCharge;
    }

    res.status(200).json({
      status: true,
      data: {
        totalSqFt,
        baseRate: sizeRangeOption.baseRate,
        extraRate: sizeRangeOption.extraRate,
        finalRate: sizeRangeOption.finalRate,
        laminationCharge: lamination ? configuration.laminationCharge : 0,
        totalPrice,
      },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Other CRUD operations
const GetAllNightGlowPrints = async (req, res, next) => { /* Implementation */ };
const GetSingleNightGlowPrint = async (req, res, next) => { /* Implementation */ };
const UpdateNightGlowPrint = async (req, res, next) => { /* Implementation */ };
const DeleteNightGlowPrint = async (req, res, next) => { /* Implementation */ };

module.exports = {
  CreateNightGlowPrint,
  CalculateNightGlowPrintPrice,
  GetAllNightGlowPrints,
  GetSingleNightGlowPrint,
  UpdateNightGlowPrint,
  DeleteNightGlowPrint,
};
