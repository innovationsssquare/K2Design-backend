const BacklitFlexPrint = require("../../../Model/Allproductschema/Mediaprinting/Backlitflexprint");
const AppErr = require("../../../Services/AppErr");

// Create Backlit Flex Print
const CreateBacklitFlexPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await BacklitFlexPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newBacklitFlexPrint = new BacklitFlexPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newBacklitFlexPrint.save();

    res.status(201).json({
      status: true,
      message: "Backlit Flex Print created successfully",
      data: newBacklitFlexPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Backlit Flex Print Price
const CalculateBacklitFlexPrintPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;

    // Calculate square feet
    const sqft = height * width;

    // Find the correct configuration
    const backlitFlexPrint = await BacklitFlexPrint.findOne({
      "configurations.type": type,
    });

    if (!backlitFlexPrint) {
      return next(new AppErr("Backlit Flex Print with specified type not found", 404));
    }

    const configuration = backlitFlexPrint.configurations.find(
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

// Get All Backlit Flex Prints
const GetAllBacklitFlexPrints = async (req, res, next) => {
  try {
    const backlitFlexPrints = await BacklitFlexPrint.find();
    res.status(200).json({
      status: true,
      data: backlitFlexPrints,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Backlit Flex Print
const GetSingleBacklitFlexPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const backlitFlexPrint = await BacklitFlexPrint.findById(id);

    if (!backlitFlexPrint) {
      return next(new AppErr("Backlit Flex Print not found", 404));
    }

    res.status(200).json({
      status: true,
      data: backlitFlexPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Backlit Flex Print
const DeleteBacklitFlexPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await BacklitFlexPrint.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Backlit Flex Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Backlit Flex Print deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateBacklitFlexPrint,
  GetAllBacklitFlexPrints,
  GetSingleBacklitFlexPrint,
  DeleteBacklitFlexPrint,
  CalculateBacklitFlexPrintPrice,
};
