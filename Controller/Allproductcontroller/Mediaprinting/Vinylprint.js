const VinylPrint = require("../../../Model/Allproductschema/Mediaprinting/Vinylprint");
const { validationResult } = require("express-validator");
const AppErr = require("../../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Vinyl Print
const CreateVinylPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    // Check if SKU is unique
    const existingProduct = await VinylPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Vinyl Print with this SKU already exists", 400));
    }

    const vinylPrint = new VinylPrint({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await vinylPrint.save();

    res.status(201).json({
      status: true,
      message: "Vinyl Print created successfully",
      data: vinylPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Vinyl Print
const UpdateVinylPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedVinylPrint = await VinylPrint.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedVinylPrint) {
      return next(new AppErr("Vinyl Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Vinyl Print updated successfully",
      data: updatedVinylPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Vinyl Prints
const GetAllVinylPrints = async (req, res, next) => {
  try {
    const vinylPrints = await VinylPrint.find();
    res.status(200).json({
      status: true,
      data: vinylPrints,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Vinyl Print by ID
const GetSingleVinylPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const vinylPrint = await VinylPrint.findById(id);

    if (!vinylPrint) {
      return next(new AppErr("Vinyl Print not found", 404));
    }

    res.status(200).json({
      status: true,
      data: vinylPrint,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Vinyl Print
const DeleteVinylPrint = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedVinylPrint = await VinylPrint.findByIdAndDelete(id);

    if (!deletedVinylPrint) {
      return next(new AppErr("Vinyl Print not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Vinyl Print deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Vinyl Print Price
// const CalculateVinylPrintPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { type, rigidSurface, size } = req.body;

//     // Find vinyl print configuration by type and rigid surface
//     const vinylPrint = await VinylPrint.findOne({
//       "configurations.type": type,
//       "configurations.rigidSurface": rigidSurface,
//     });

//     if (!vinylPrint) {
//       return next(new AppErr("Vinyl Print with specified type and rigid surface not found", 404));
//     }

//     // Find size range and rates
//     const configuration = vinylPrint.configurations.find(
//       (config) => config.type === type && config.rigidSurface === rigidSurface
//     );

//     const sizeOption = configuration.sizeRange.find(
//       (range) => size >= range.startSqFt && size <= range.endSqFt
//     );

//     if (!sizeOption) {
//       return next(new AppErr("Invalid size range selected", 400));
//     }

//     // Calculate total price
//     const totalPrice = size * sizeOption.finalRate;

//     res.status(200).json({
//       status: true,
//       data: { totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

// const CalculateVinylPrintPrice = async (req, res, next) => {
//     try {
//       const { type, rigidSurface, height, width } = req.body;
  
//       // Calculate total square footage
//       const totalSqFt = height * width;
  
//       // Find the Vinyl Print configuration
//       const vinylPrint = await VinylPrint.findOne({
//         "configurations.type": type,
//         "configurations.rigidSurface": rigidSurface,
//       });
  
//       if (!vinylPrint) {
//         return next(new AppErr("Vinyl Print with specified type and rigid surface not found", 404));
//       }
  
//       // Find the correct size range for the given square footage
//       const configuration = vinylPrint.configurations.find(
//         (config) => config.type === type && config.rigidSurface === rigidSurface
//       );
  
//       if (!configuration) {
//         return next(new AppErr("Configuration for the given type and material not found", 404));
//       }
  
//       const matchingRate = configuration.sizeRange.find(
//         (range) => totalSqFt >= range.startSqFt && totalSqFt <= range.endSqFt
//       );
  
//       if (!matchingRate) {
//         return next(new AppErr("No pricing found for the given square footage", 400));
//       }
  
//       // Calculate price
//       const baseRate = matchingRate.baseRate;
//       const extraRate = matchingRate.extraRate;
//       const finalRate = matchingRate.finalRate;
  
//       const totalPrice = totalSqFt * finalRate; // Multiply by calculated sqft
  
//       res.status(200).json({
//         status: true,
//         data: {
//           totalSqFt,
//           baseRate,
//           extraRate,
//           finalRate,
//           totalPrice,
//         },
//       });
//     } catch (error) {
//       next(new AppErr(error.message, 500));
//     }
//   };
  
const CalculateVinylPrintPrice = async (req, res, next) => {
  try {
      const { type, rigidSurface, height, width, applyDiscount } = req.body;

      // Calculate total square footage
      const totalSqFt = height * width;

      // Find the Vinyl Print configuration
      const vinylPrint = await VinylPrint.findOne({
          "configurations.type": type,
          "configurations.rigidSurface": rigidSurface,
      });

      if (!vinylPrint) {
          return next(new AppErr("Vinyl Print with specified type and rigid surface not found", 404));
      }

      // Find the correct size range for the given square footage
      const configuration = vinylPrint.configurations.find(
          (config) => config.type === type && config.rigidSurface === rigidSurface
      );

      if (!configuration) {
          return next(new AppErr("Configuration for the given type and material not found", 404));
      }

      const matchingRate = configuration.sizeRange.find(
          (range) => totalSqFt >= range.startSqFt && totalSqFt <= range.endSqFt
      );

      if (!matchingRate) {
          return next(new AppErr("No pricing found for the given square footage", 400));
      }

      // Calculate price
      const baseRate = matchingRate.baseRate;
      const extraRate = matchingRate.extraRate;
      const finalRate = matchingRate.finalRate;

      let totalPrice = totalSqFt * finalRate; 

      if (applyDiscount) {
          totalPrice = totalPrice - totalPrice * 0.10; // 10% discount
      }

      res.status(200).json({
          status: true,
          data: {
              totalSqFt,
              baseRate,
              extraRate,
              finalRate,
              totalPrice,
              discountApplied: applyDiscount || false,
          },
      });
  } catch (error) {
      next(new AppErr(error.message, 500));
  }
};



module.exports = {
  CreateVinylPrint,
  UpdateVinylPrint,
  GetAllVinylPrints,
  GetSingleVinylPrint,
  DeleteVinylPrint,
  CalculateVinylPrintPrice,
};
