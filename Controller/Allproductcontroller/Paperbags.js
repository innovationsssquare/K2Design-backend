const PaperBag = require("../../Model/Allproductschema/Paperbags");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Paper Bag
const CreatePaperBag = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, subcategoryId, price, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await PaperBag.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newPaperBag = new PaperBag({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      configurations,
    });

    await newPaperBag.save();

    res.status(201).json({
      status: true,
      message: "Paper Bag created successfully",
      data: newPaperBag,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Paper Bag
const UpdatePaperBag = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await PaperBag.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Paper Bag not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Paper Bag updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Paper Bags
const GetAllPaperBags = async (req, res, next) => {
  try {
    const paperBags = await PaperBag.find();
    res.status(200).json({
      status: true,
      data: paperBags,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Paper Bag by ID
const GetSinglePaperBag = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const paperBag = await PaperBag.findById(id);

    if (!paperBag) {
      return next(new AppErr("Paper Bag not found", 404));
    }

    res.status(200).json({
      status: true,
      data: paperBag,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Paper Bag
const DeletePaperBag = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedProduct = await PaperBag.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Paper Bag not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Paper Bag deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Paper Bag Price
const CalculatePaperBagPrice = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const { size, qty, extraOptions } = req.body;
  
      // Find the paper bag by size
      const paperBag = await PaperBag.findOne({
        "configurations.size": size,
      });
  
      if (!paperBag) {
        return next(new AppErr("Paper Bag with specified size not found", 404));
      }
  
      // Find the specific configuration by size
      const configuration = paperBag.configurations.find((config) => config.size === size);
  
      if (!configuration) {
        return next(new AppErr("Configuration for the specified size not found", 404));
      }
  
      // Find the specific quantity option
      const quantityOption = configuration.quantities.find((q) => q.qty === qty);
  
      if (!quantityOption) {
        return next(new AppErr("Invalid quantity selected", 400));
      }
  
      // Base price calculation
      const basePrice = quantityOption.costPerUnit * qty;
  
      // Extra costs calculation
      let extraCost = 0;
      if (extraOptions?.spotandmattLamination) {
        extraCost += (quantityOption.extraCosts.spotandmattLamination || 0) * qty;
      }
      if (extraOptions?.mattLamination) {
        extraCost += (quantityOption.extraCosts.mattLamination || 0) * qty;
      }
      if (extraOptions?.silverandgoldFoil) {
        extraCost += (quantityOption.extraCosts.silverandgoldFoil || 0) * qty;
      }
  
      // Calculate total price
      const totalPrice = basePrice + extraCost;
  
      // Send the response
      res.status(200).json({
        status: true,
        data: { basePrice, extraCost, totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

module.exports = {
  CreatePaperBag,
  UpdatePaperBag,
  GetAllPaperBags,
  GetSinglePaperBag,
  DeletePaperBag,
  CalculatePaperBagPrice,
};
