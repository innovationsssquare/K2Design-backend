const FlexBannerPrintpremium = require("../../../Model/Allproductschema/Flexprinting/Flexbannerpremium");
const AppErr = require("../../../Services/AppErr");

// Create Flex Banner Print
const CreateFlexBannerPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await FlexBannerPrintpremium.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new FlexBannerPrintpremium({
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
      message: "Flex Banner Print created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
const CalculateFlexBannerPrintPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqft = height * width;

    const product = await FlexBannerPrintpremium.findOne({
      "configurations.type": type,
    });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    const sizeOption = configuration.sizeRange.find(
      (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    const totalPrice = sizeOption.finalRate * sqft;

    res.status(200).json({
      status: true,
      data: { sqft, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Flex Banner Prints
const GetAllFlexBannerPrints = async (req, res, next) => {
  try {
    const products = await FlexBannerPrintpremium.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Flex Banner Print
const GetSingleFlexBannerPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await FlexBannerPrintpremium.findById(id);

    if (!product) {
      return next(new AppErr("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Flex Banner Print
const UpdateFlexBannerPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await FlexBannerPrintpremium.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Flex Banner Print
const DeleteFlexBannerPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FlexBannerPrintpremium.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFlexBannerPrint,
  CalculateFlexBannerPrintPrice,
  GetAllFlexBannerPrints,
  GetSingleFlexBannerPrint,
  UpdateFlexBannerPrint,
  DeleteFlexBannerPrint,
};
