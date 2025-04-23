const BacklitFlexBoard = require("../../../Model/Allproductschema/Light BoardLED Board/backlitFlexBoard");
const AppErr = require("../../../Services/AppErr");

// Create Product
exports.createBacklitFlexBoard = async (req, res, next) => {
  try {
    const product = new BacklitFlexBoard(req.body);
    await product.save();
    res.status(201).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Products
exports.getAllBacklitFlexBoards = async (req, res, next) => {
  try {
    const products = await BacklitFlexBoard.find();
    res.status(200).json({ status: true, data: products });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Product
exports.getSingleBacklitFlexBoard = async (req, res, next) => {
  try {
    const product = await BacklitFlexBoard.findById(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Product
exports.updateBacklitFlexBoard = async (req, res, next) => {
  try {
    const product = await BacklitFlexBoard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Product
exports.deleteBacklitFlexBoard = async (req, res, next) => {
  try {
    const product = await BacklitFlexBoard.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
exports.calculateBacklitFlexBoardPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqFt = (height * width);

    const product = await BacklitFlexBoard.findOne({ "configurations.type": type });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

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
