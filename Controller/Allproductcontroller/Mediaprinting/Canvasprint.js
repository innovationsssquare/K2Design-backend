const CanvasPrint = require("../../../Model/Allproductschema/Mediaprinting/Canvasprint");
const { validationResult } = require("express-validator");
const AppErr = require("../../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Canvas Print
const CreateCanvasPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU is unique
    const existingCanvasPrint = await CanvasPrint.findOne({ sku });
    if (existingCanvasPrint) {
      return next(new AppErr("Canvas Print with this SKU already exists", 400));
    }

    const canvasPrint = new CanvasPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await canvasPrint.save();

    res.status(201).json({
      status: true,
      message: "Canvas Print created successfully",
      data: canvasPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// // Calculate Canvas Print Price
// const CalculateCanvasPrintPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { type, height, width } = req.body;
    
//     // Calculate square feet
//     const sqft = (height * width) / 144;

//     // Find the correct configuration
//     const canvasPrint = await CanvasPrint.findOne({
//       "configurations.type": type,
//     });

//     if (!canvasPrint) {
//       return next(new AppErr("Canvas Print with specified type not found", 404));
//     }

//     const configuration = canvasPrint.configurations.find(
//       (config) => config.type === type
//     );

//     if (!configuration) {
//       return next(new AppErr("Configuration for the specified type not found", 404));
//     }

//     // Find the matching size range
//     const sizeOption = configuration.sizeRange.find(
//       (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
//     );

//     if (!sizeOption) {
//       return next(new AppErr("Invalid size range selected", 400));
//     }

//     // Calculate total price
//     const totalPrice = sizeOption.finalRate * sqft;

//     res.status(200).json({
//       status: true,
//       data: { sqft, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

const CalculateCanvasPrintPrice = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const { type, height, width,applyDiscount } = req.body;
  
      // Calculate square footage (sqft) directly in feet
      const sqft = height * width;
  
      // Find the correct configuration
      const canvasPrint = await CanvasPrint.findOne({
        "configurations.type": type,
      });
  
      if (!canvasPrint) {
        return next(new AppErr("Canvas Print with specified type not found", 404));
      }
  
      const configuration = canvasPrint.configurations.find(
        (config) => config.type === type
      );
  
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
  
      // ✅ Final Price Calculation
      let totalPrice = sqft * sizeOption.finalRate; // Multiply sqft with final rate

      if (applyDiscount) {
        totalPrice = totalPrice - totalPrice * 0.10; // 10% discount
      }

      res.status(200).json({
        status: true,
        data: { sqft, totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  


// Get All Canvas Prints
const GetAllCanvasPrints = async (req, res, next) => {
  try {
    const canvasPrints = await CanvasPrint.find();
    res.status(200).json({
      status: true,
      data: canvasPrints,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Canvas Print by ID
const GetSingleCanvasPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const canvasPrint = await CanvasPrint.findById(id);

    if (!canvasPrint) {
      return next(new AppErr("Canvas Print not found", 404));
    }

    res.status(200).json({
      status: true,
      data: canvasPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Canvas Print
const DeleteCanvasPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedCanvasPrint = await CanvasPrint.findByIdAndDelete(id);

    if (!deletedCanvasPrint) {
      return next(new AppErr("Canvas Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Canvas Print deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateCanvasPrint,
  CalculateCanvasPrintPrice,
  GetAllCanvasPrints,
  GetSingleCanvasPrint,
  DeleteCanvasPrint,
};
