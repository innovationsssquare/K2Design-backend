const FlatSign = require("../../../Model/Allproductschema/Modernproduct/FlatSign");
const AppErr = require("../../../Services/AppErr");

// Create
const CreateFlatSign = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await FlatSign.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new FlatSign({ name, categoryId, sku, description, images, configurations });
    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
const CalculateFlatSignPrice = async (req, res, next) => {
  try {
    const { mainType, widthMM, heightMM ,qty} = req.body;

    const product = await FlatSign.findOne({ "configurations.mainType": mainType });
    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.mainType === mainType);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    const sizeOption = configuration.frameSizes.find(
      (frame) => frame.widthMM === widthMM && frame.heightMM === heightMM
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid size selected", 400));
    }

    const pricePerUnit = sizeOption.customerCostWithPrint;
    const quantity = qty || 1;
    const totalPrice = pricePerUnit * quantity;

    res.status(200).json({
      status: true,
      data: { widthMM, heightMM, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All
const GetAllFlatSigns = async (req, res, next) => {
  try {
    const products = await FlatSign.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single
const GetSingleFlatSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await FlatSign.findById(id);

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

// Update
const UpdateFlatSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await FlatSign.findByIdAndUpdate(id, updates, {
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

// Delete
const DeleteFlatSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    await FlatSign.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFlatSign,
  CalculateFlatSignPrice,
  GetAllFlatSigns,
  GetSingleFlatSign,
  UpdateFlatSign,
  DeleteFlatSign,
};
