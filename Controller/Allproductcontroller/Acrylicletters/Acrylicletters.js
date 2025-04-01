const AcrylicLettersNumbers = require("../../../Model/Allproductschema/Acrylicletters/Acrylicletters");
const AppErr = require("../../../Services/AppErr");

// Add a new Acrylic Letters & Numbers product
const addAcrylicLettersNumbers = async (req, res, next) => {
  try {
    const product = new AcrylicLettersNumbers(req.body);
    await product.save();

    res.status(201).json({
      status: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get all Acrylic Letters & Numbers products
const getAllAcrylicLettersNumbers = async (req, res, next) => {
  try {
    const products = await AcrylicLettersNumbers.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a single Acrylic Letters & Numbers product by ID
const getAcrylicLettersNumbersById = async (req, res, next) => {
  try {
    const product = await AcrylicLettersNumbers.findById(req.params.id);

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

// Update a Acrylic Letters & Numbers product
const updateAcrylicLettersNumbers = async (req, res, next) => {
  try {
    const updatedProduct = await AcrylicLettersNumbers.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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

// Delete a Acrylic Letters & Numbers product
const deleteAcrylicLettersNumbers = async (req, res, next) => {
  try {
    const deletedProduct = await AcrylicLettersNumbers.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate price based on size
const calculateAcrylicLettersNumbersPrice = async (req, res, next) => {
  try {
    const { thickness, height, width } = req.body;
    const sqFt = (height * width)
    const product = await AcrylicLettersNumbers.findOne({
      "configurations.thickness": thickness,
    });

    if (!product) {
      return next(new AppErr("Product with specified thickness not found", 404));
    }

    const configuration = product.configurations.find(
      (config) => config.thickness === thickness
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the specified thickness not found", 404));
    }
  //  console.log(configuration)
    const sizeOption = configuration.sizeRange.find(
      (range) => sqFt >= range.startSqFt && sqFt <= range.endSqFt
    );
    if (!sizeOption) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    const totalPrice = sizeOption.finalSqFtRate * sqFt;

    res.status(200).json({
      status: true,
      data: { sqFt, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  addAcrylicLettersNumbers,
  getAllAcrylicLettersNumbers,
  getAcrylicLettersNumbersById,
  updateAcrylicLettersNumbers,
  deleteAcrylicLettersNumbers,
  calculateAcrylicLettersNumbersPrice,
};
