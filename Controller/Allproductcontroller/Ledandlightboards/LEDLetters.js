const LEDLetters = require("../../../Model/Allproductschema/Light BoardLED Board/LEDLetters");
const AppErr = require("../../../Services/AppErr");

// Create LED Letter Product
exports.createLEDLetter = async (req, res, next) => {
  try {
    const newProduct = await LEDLetters.create(req.body);
    res.status(201).json({ status: true, data: newProduct });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All LED Letters
exports.getAllLEDLetters = async (req, res, next) => {
  try {
    const products = await LEDLetters.find();
    res.status(200).json({ status: true, data: products });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single LED Letter Product
exports.getSingleLEDLetter = async (req, res, next) => {
  try {
    const product = await LEDLetters.findById(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update LED Letter Product
exports.updateLEDLetter = async (req, res, next) => {
  try {
    const updatedProduct = await LEDLetters.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: updatedProduct });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete LED Letter Product
exports.deleteLEDLetter = async (req, res, next) => {
  try {
    const deletedProduct = await LEDLetters.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate LED Letter Price
exports.calculateLEDLetterPrice = async (req, res, next) => {
  try {
    const { type, runningInch } = req.body;

    const product = await LEDLetters.findOne({ "configurations.type": type });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    const sizeOption = configuration.sizeRange.find(
      (range) => runningInch >= range.startInch && runningInch <= range.endInch
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    const totalPrice = sizeOption.customerCostPerInch * runningInch;

    res.status(200).json({
      status: true,
      data: { runningInch, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};
