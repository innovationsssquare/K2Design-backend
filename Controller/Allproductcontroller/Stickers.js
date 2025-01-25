const StickerLabel = require("../../Model/Allproductschema/Stickers");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Sticker/Label
const CreateStickerLabel = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, subcategoryId, price, sku, description, images, configurations, customizations } = req.body;

    // Check if SKU already exists
    const existingProduct = await StickerLabel.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newStickerLabel = new StickerLabel({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      configurations,
      customizations,
    });

    await newStickerLabel.save();

    res.status(201).json({
      status: true,
      message: "Sticker/Label created successfully",
      data: newStickerLabel,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Sticker/Label
const UpdateStickerLabel = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await StickerLabel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Sticker/Label not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Sticker/Label updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Stickers/Labels
const GetAllStickerLabels = async (req, res, next) => {
  try {
    const stickerLabels = await StickerLabel.find();
    res.status(200).json({
      status: true,
      data: stickerLabels,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Sticker/Label by ID
const GetSingleStickerLabel = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const stickerLabel = await StickerLabel.findById(id);

    if (!stickerLabel) {
      return next(new AppErr("Sticker/Label not found", 404));
    }

    res.status(200).json({
      status: true,
      data: stickerLabel,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Sticker/Label
const DeleteStickerLabel = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedProduct = await StickerLabel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Sticker/Label not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Sticker/Label deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Sticker/Label Price
// const CalculateStickerLabelPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { size, qty, extraOptions } = req.body;

//     // Find the sticker/label document
//     const stickerLabel = await StickerLabel.findOne({
//       $or: [
//         { "configurations.size": size },
//         { "customizations.size": size },
//       ],
//     });

//     if (!stickerLabel) {
//       return next(new AppErr("Sticker/Label with specified size not found", 404));
//     }

//     // Try to find the size in configurations (fixed sizes)
//     const configuration = stickerLabel.configurations.find((config) => config.size === size);
//     let priceDetails;

//     if (configuration) {
//       // Find the specific quantity option
//       const quantityOption = configuration.quantities.find((q) => q.qty === qty);

//       if (!quantityOption) {
//         return next(new AppErr("Invalid quantity selected for the specified size", 400));
//       }

//       // Calculate base price and extra cost
//       const basePrice = quantityOption.unitRate * qty;
//       const extraCost = (extraOptions?.laminationCost || 0);
//       priceDetails = { basePrice, extraCost, totalPrice: basePrice + extraCost };
//     } else {
//       // Try to find the size in customizations
//       const customization = stickerLabel.customizations.find((cust) => cust.size === size);

//       if (!customization) {
//         return next(new AppErr("Configuration or customization for the specified size not found", 404));
//       }

//       // Find the matching range for quantity
//       const quantityRange = customization.quantities.find(
//         (range) => qty >= range.minQty && qty <= range.maxQty
//       );

//       if (!quantityRange) {
//         return next(new AppErr("Invalid quantity selected for customization", 400));
//       }

//       // Calculate base price and extra cost
//       const basePrice = quantityRange.unitRate * qty;
//       const extraCost = (extraOptions?.laminationCost || 0) ;
//       priceDetails = { basePrice, extraCost, totalPrice: basePrice + extraCost };
//     }

//     // Send the response
//     res.status(200).json({
//       status: true,
//       data: priceDetails,
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

const CalculateStickerLabelPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { size, qty } = req.body;

    // Find the sticker/label document
    const stickerLabel = await StickerLabel.findOne({
      $or: [
        { "configurations.size": size },
        { "customizations.size": size },
      ],
    });

    if (!stickerLabel) {
      return next(new AppErr("Sticker/Label with specified size not found", 404));
    }

    let priceDetails;

    // Try to find the size in configurations (fixed sizes)
    const configuration = stickerLabel.configurations.find((config) => config.size === size);

    if (configuration) {
      // Find the specific quantity option
      const quantityOption = configuration.quantities.find((q) => q.qty === qty);

      if (!quantityOption) {
        return next(new AppErr("Invalid quantity selected for the specified size", 400));
      }

      // Calculate base price and extra cost
      const basePrice = quantityOption.unitRate * qty;
      const extraCost = quantityOption.laminationCost; // Retrieve lamination cost from the array
      priceDetails = { basePrice, extraCost, totalPrice: basePrice + extraCost };
    } else {
      // Try to find the size in customizations
      const customization = stickerLabel.customizations.find((cust) => cust.size === size);

      if (!customization) {
        return next(new AppErr("Configuration or customization for the specified size not found", 404));
      }

      // Find the matching range for quantity
      const quantityRange = customization.quantities.find(
        (range) => qty >= range.minQty && qty <= range.maxQty
      );

      if (!quantityRange) {
        return next(new AppErr("Invalid quantity selected for customization", 400));
      }

      // Calculate base price and extra cost
      const basePrice = quantityRange.unitRate * qty;
      const extraCost = quantityRange.laminationCost; // Retrieve lamination cost from the array
      priceDetails = { basePrice, extraCost, totalPrice: basePrice + extraCost };
    }

    // Send the response
    res.status(200).json({
      status: true,
      data: priceDetails,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};




module.exports = {
  CreateStickerLabel,
  UpdateStickerLabel,
  GetAllStickerLabels,
  GetSingleStickerLabel,
  DeleteStickerLabel,
  CalculateStickerLabelPrice,
};
