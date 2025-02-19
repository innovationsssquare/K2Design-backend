const FlexBannerPrint = require("../../../Model/Allproductschema/Flexprinting/FlexBannerPrintadvertise");
const AppErr = require("../../../Services/AppErr");

// Create Flex Banner Print
const CreateFlexBannerPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await FlexBannerPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newFlexBannerPrint = new FlexBannerPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newFlexBannerPrint.save();

    res.status(201).json({
      status: true,
      message: "Flex Banner Print created successfully",
      data: newFlexBannerPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Flex Banner Print Price
const CalculateFlexBannerPrintPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqft = height * width;

    // Find flex banner configuration by type
    const flexBanner = await FlexBannerPrint.findOne({
      "configurations.type": type,
    });

    if (!flexBanner) {
      return next(new AppErr("Flex Banner with specified type not found", 404));
    }

    const configuration = flexBanner.configurations.find(
      (config) => config.type === type
    );

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
    const flexBanners = await FlexBannerPrint.find();
    res.status(200).json({
      status: true,
      data: flexBanners,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Flex Banner Print
const GetSingleFlexBannerPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flexBanner = await FlexBannerPrint.findById(id);

    if (!flexBanner) {
      return next(new AppErr("Flex Banner Print not found", 404));
    }

    res.status(200).json({
      status: true,
      data: flexBanner,
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

    const updatedFlexBannerPrint = await FlexBannerPrint.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFlexBannerPrint) {
      return next(new AppErr("Flex Banner Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Banner Print updated successfully",
      data: updatedFlexBannerPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Flex Banner Print
const DeleteFlexBannerPrint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await FlexBannerPrint.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Flex Banner Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Banner Print deleted successfully",
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
