const RollUpStandee = require("../../../Model/Allproductschema/Flexprinting/Flexrollupstand");
const { validationResult } = require("express-validator");
const AppErr = require("../../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Roll Up Standee
const CreateRollUpStandee = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU is unique
    const existingStandee = await RollUpStandee.findOne({ sku });
    if (existingStandee) {
      return next(new AppErr("Standee with this SKU already exists", 400));
    }

    const standee = new RollUpStandee({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await standee.save();

    res.status(201).json({
      status: true,
      message: "Roll Up Standee created successfully",
      data: standee,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Roll Up Standees
const GetAllRollUpStandees = async (req, res, next) => {
  try {
    const standees = await RollUpStandee.find();
    res.status(200).json({
      status: true,
      data: standees,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Roll Up Standee by ID
const GetSingleRollUpStandee = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const standee = await RollUpStandee.findById(id);

    if (!standee) {
      return next(new AppErr("Standee not found", 404));
    }

    res.status(200).json({
      status: true,
      data: standee,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Roll Up Standee
const UpdateRollUpStandee = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedStandee = await RollUpStandee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedStandee) {
      return next(new AppErr("Standee not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Standee updated successfully",
      data: updatedStandee,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Roll Up Standee
const DeleteRollUpStandee = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedStandee = await RollUpStandee.findByIdAndDelete(id);

    if (!deletedStandee) {
      return next(new AppErr("Standee not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Standee deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



const CalculateRollUpStandeePrice = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const { size, quantity, flexType } = req.body;
  
      // Find the standee configuration based on size
      const standee = await RollUpStandee.findOne({ "configurations.size": size });
  
      if (!standee) {
        return next(new AppErr("Standee with specified size not found", 404));
      }
  
      const configuration = standee.configurations.find((config) => config.size === size);
  
      if (!configuration) {
        return next(new AppErr("Configuration for the specified size not found", 404));
      }
  
      // Select the flex price based on flexType
      let basePrice;
      switch (flexType) {
        case "economy":
          basePrice = configuration.pricing.economyFlexPrice;
          break;
        case "premium":
          basePrice = configuration.pricing.premiumFlexPrice;
          break;
        case "hpLatexPremium":
          basePrice = configuration.pricing.hpLatexPremiumFlexPrice;
          break;
        default:
          return next(new AppErr("Invalid flex type selected", 400));
      }
  
      // Calculate total price before discount
      let totalPrice = basePrice * quantity;
  
      // Apply discount based on quantity range
      const discount = configuration.discountStructure.find(
        (discount) => quantity >= discount.minQty && quantity <= discount.maxQty
      );
  
      if (discount) {
        totalPrice = totalPrice - (totalPrice * discount.discountPercentage) / 100;
      }
  
      res.status(200).json({
        status: true,
        data: {
          basePrice,
          quantity,
          flexType,
          discountApplied: discount ? discount.discountPercentage : 0,
          totalPrice: totalPrice.toFixed(2),
        },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

module.exports = {
  CreateRollUpStandee,
  UpdateRollUpStandee,
  GetAllRollUpStandees,
  GetSingleRollUpStandee,
  DeleteRollUpStandee,
  CalculateRollUpStandeePrice
};
