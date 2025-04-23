const ACPStencilLED = require("../../../Model/Allproductschema/Light BoardLED Board/ACPStencilLED");
const AppErr = require("../../../Services/AppErr");

// Create Product
exports.createACPStencilLED = async (req, res, next) => {
  try {
    const product = new ACPStencilLED(req.body);
    await product.save();
    res.status(201).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Products
exports.getAllACPStencilLED = async (req, res, next) => {
  try {
    const products = await ACPStencilLED.find();
    res.status(200).json({ status: true, data: products });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Product
exports.getSingleACPStencilLED = async (req, res, next) => {
  try {
    const product = await ACPStencilLED.findById(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Product
exports.updateACPStencilLED = async (req, res, next) => {
  try {
    const product = await ACPStencilLED.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Product
exports.deleteACPStencilLED = async (req, res, next) => {
  try {
    const product = await ACPStencilLED.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Product deleted" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
exports.calculateACPStencilLEDPrice = async (req, res, next) => {
    try {
      const { type, height, width } = req.body;
  
      // Validate input
      if (!type || !height || !width) {
        return next(new AppErr("Type, height, and width are required", 400));
      }
  
      // Calculate square footage
      const sqFt = (height * width)
  
      const product = await ACPStencilLED.findOne({ "configurations.type": type });
  
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
  
      // Calculate total price
      let totalPrice = sizeOption.customerCostPerInch * sqFt;
  
      // Apply extra discount if available
    //   if (sizeOption.extraDiscount) {
    //     totalPrice -= (totalPrice * sizeOption.extraDiscount) / 100;
    //   }
  
      res.status(200).json({
        status: true,
        data: { height, width, sqFt, totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
