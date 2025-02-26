const FlexWoodenFrame = require("../../../Model/Allproductschema/Flexprinting/Flexbannerwood");
const AppErr = require("../../../Services/AppErr");
const { validationResult } = require("express-validator");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// **Create Flex Banner with Wooden Frame**
const CreateFlexBannerWoodenFrame = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await FlexWoodenFrame.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new FlexWoodenFrame({
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
      message: "Flex Banner with Wooden Frame created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// **Calculate Price for Flex Banner with Wooden Frame**
const CalculateFlexBannerWoodenFramePrice = async (req, res, next) => {
    try {
      const { size, type, sqft } = req.body;
  
     
  
      // Find the correct configuration
      const product = await FlexWoodenFrame.findOne({
        "configurations.size": size,
      });
  
      if (!product) {
        return next(new AppErr("Flex Banner with Wooden Frame of specified size not found", 404));
      }
  
      const configuration = product.configurations.find(
        (config) => config.size === size
      );
  
      if (!configuration) {
        return next(new AppErr("Configuration for the specified size not found", 404));
      }
  
      // Select Rate Based on Type
      let rate = 0;
      if (type === "Economy") {
        rate = configuration.economyRate;
      } else if (type === "Premium") {
        rate = configuration.premiumRate;
      } else {
        return next(new AppErr("Invalid type selected. Must be 'Economy' or 'Premium'", 400));
      }
  
      // Calculate total price
      const totalPriceBeforeDiscount = rate * sqft;
  
      // Apply discount
      const discountAmount = (configuration.discount / 100) * totalPriceBeforeDiscount;
      const finalTotalPrice = totalPriceBeforeDiscount - discountAmount;
  
      res.status(200).json({
        status: true,
        data: {
          sqft,
          rate,
          discount: configuration.discount,
          totalPriceBeforeDiscount,
          discountAmount,
          finalTotalPrice,
        },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

// **Get All Flex Banners with Wooden Frame**
const GetAllFlexBannerWoodenFrames = async (req, res, next) => {
  try {
    const products = await FlexWoodenFrame.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// **Get Single Flex Banner with Wooden Frame**
const GetSingleFlexBannerWoodenFrame = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const product = await FlexWoodenFrame.findById(id);

    if (!product) {
      return next(new AppErr("Flex Banner with Wooden Frame not found", 404));
    }

    res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// **Update Flex Banner with Wooden Frame**
const UpdateFlexBannerWoodenFrame = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await FlexWoodenFrame.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Flex Banner with Wooden Frame not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Banner with Wooden Frame updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// **Delete Flex Banner with Wooden Frame**
const DeleteFlexBannerWoodenFrame = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedProduct = await FlexWoodenFrame.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Flex Banner with Wooden Frame not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Flex Banner with Wooden Frame deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFlexBannerWoodenFrame,
  CalculateFlexBannerWoodenFramePrice,
  GetAllFlexBannerWoodenFrames,
  GetSingleFlexBannerWoodenFrame,
  UpdateFlexBannerWoodenFrame,
  DeleteFlexBannerWoodenFrame,
};
