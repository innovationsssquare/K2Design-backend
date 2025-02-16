const OneWayVision = require("../../../Model/Allproductschema/Glassfilms/Onewayvision");
const AppErr = require("../../../Services/AppErr");

// Create One Way Vision Print
const CreateOneWayVision = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await OneWayVision.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new OneWayVision({
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
      message: "One Way Vision Print added successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
const CalculateOneWayVisionPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqft = height * width;

    // Find product configuration
    const product = await OneWayVision.findOne({ "configurations.type": type });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);
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

    const totalPrice = sizeOption.finalRate * sqft;

    res.status(200).json({
      status: true,
      data: { sqft, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All One Way Vision Prints
const GetAllOneWayVisions = async (req, res, next) => {
  try {
    const products = await OneWayVision.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single One Way Vision Print
const GetSingleOneWayVision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await OneWayVision.findById(id);

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

// Update One Way Vision Print
const UpdateOneWayVision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await OneWayVision.findByIdAndUpdate(id, updates, {
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

module.exports = {
  CreateOneWayVision,
  CalculateOneWayVisionPrice,
  GetAllOneWayVisions,
  GetSingleOneWayVision,
  UpdateOneWayVision,
};
