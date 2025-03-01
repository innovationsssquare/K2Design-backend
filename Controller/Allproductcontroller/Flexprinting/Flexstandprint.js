const FlexStand = require("../../../Model/Allproductschema/Flexprinting/Flexstandprint");
const { validationResult } = require("express-validator");
const AppErr = require("../../../Services/AppErr");

// Utility to validate requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Flex Stand
const CreateFlexStand = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await FlexStand.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Flex Stand with this SKU already exists", 400));
    }

    const flexStand = new FlexStand({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await flexStand.save();

    res.status(201).json({
      status: true,
      message: "Flex Stand created successfully",
      data: flexStand,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Flex Stand Price
const CalculateFlexStandPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { standType, frameSize, msTubeType, flexType, sideType } = req.body;

    // Find matching product configuration
    const flexStand = await FlexStand.findOne({
      "configurations.standType": standType,
    });

    if (!flexStand) {
      return next(new AppErr("Flex Stand with specified type not found", 404));
    }

    const configuration = flexStand.configurations.find(
      (config) => config.standType === standType
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    // Find the matching frame size
    const frameOption = configuration.frameRates.find(
      (frame) => frame.frameSize === frameSize
    );

    if (!frameOption) {
      return next(new AppErr("Invalid frame size selected", 400));
    }

    // Get MS Tube Rate
    const msTubeRate = frameOption.msTubeRates[msTubeType];
    if (!msTubeRate) {
      return next(new AppErr("Invalid MS Tube type selected", 400));
    }

    // Get Flex Rate (Economy or Premium, One-Side or Two-Side)
    let flexRate;
    if (flexType === "Economy") {
      flexRate = frameOption.economyFlexRates[sideType];
    } else if (flexType === "Premium") {
      flexRate = frameOption.premiumFlexRates[sideType];
    } else {
      return next(new AppErr("Invalid flex type selected", 400));
    }

    if (!flexRate) {
      return next(new AppErr("Invalid side type selected", 400));
    }

    // Calculate total price
    const totalPrice = msTubeRate + flexRate;

    res.status(200).json({
      status: true,
      data: { totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Flex Stands
const GetAllFlexStands = async (req, res, next) => {
  try {
    const flexStands = await FlexStand.find();
    res.status(200).json({
      status: true,
      data: flexStands,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Flex Stand
const GetSingleFlexStand = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const flexStand = await FlexStand.findById(id);

    if (!flexStand) {
      return next(new AppErr("Flex Stand not found", 404));
    }

    res.status(200).json({
      status: true,
      data: flexStand,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Flex Stand
const UpdateFlexStand = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedFlexStand = await FlexStand.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFlexStand) {
      return next(new AppErr("Flex Stand not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Stand updated successfully",
      data: updatedFlexStand,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Flex Stand
const DeleteFlexStand = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedFlexStand = await FlexStand.findByIdAndDelete(id);

    if (!deletedFlexStand) {
      return next(new AppErr("Flex Stand not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Stand deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFlexStand,
  UpdateFlexStand,
  GetAllFlexStands,
  GetSingleFlexStand,
  DeleteFlexStand,
  CalculateFlexStandPrice,
};
