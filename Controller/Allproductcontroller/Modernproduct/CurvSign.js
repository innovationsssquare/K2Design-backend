const CurvSign = require("../../../Model/Allproductschema/Modernproduct/CurvSign");
const AppErr = require("../../../Services/AppErr");
 

// Create CurvSign Product
const CreateCurvSign = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check for duplicate SKU
    const existingProduct = await CurvSign.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new CurvSign({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations, // ⚡ Now configurations contains frameSizes array inside
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Curv Sign product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};


// Calculate Price
const CalculateCurvSignPrice = async (req, res, next) => {
  try {
    const { type, widthMM, heightMM, qty } = req.body;

    const product = await CurvSign.findOne({ "configurations.type": type });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find(
      (config) => config.type === type
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    if (!configuration.frameSizes || configuration.frameSizes.length === 0) {
      return next(new AppErr("No frame sizes available for this type", 400));
    }

    const sizeOption = configuration.frameSizes.find(
      (frame) => frame.widthMM === widthMM && frame.heightMM === heightMM
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid width or height selected", 400));
    }

    // Calculate total for one unit
    const pricePerUnit = sizeOption.customerCostWithPrint;

    // Multiply by qty if provided, else assume qty = 1
    const quantity = qty || 1;
    const totalPrice = pricePerUnit * quantity;

    res.status(200).json({
      status: true,
      data: { widthMM, heightMM, qty: quantity, pricePerUnit, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

  

// Get All
const GetAllCurvSigns = async (req, res, next) => {
  try {
    const products = await CurvSign.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single
const GetSingleCurvSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await CurvSign.findById(id);

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
const UpdateCurvSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await CurvSign.findByIdAndUpdate(id, updates, {
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
const DeleteCurvSign = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CurvSign.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateCurvSign,
  CalculateCurvSignPrice,
  GetAllCurvSigns,
  GetSingleCurvSign,
  UpdateCurvSign,
  DeleteCurvSign,
};
