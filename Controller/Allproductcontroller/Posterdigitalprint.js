const PrintProduct = require("../../Model/Allproductschema/Posterdigitalprint");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create a new Print Product
const CreatePrintProduct = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { name, subcategoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await PrintProduct.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const printProduct = new PrintProduct({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await printProduct.save();

    res.status(201).json({
      status: true,
      message: "Print Product created successfully",
      data: printProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update a Print Product
const UpdatePrintProduct = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await PrintProduct.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Print Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Print Products
const GetAllPrintProducts = async (req, res, next) => {
  try {
    const products = await PrintProduct.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a Single Print Product by ID
const GetSinglePrintProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await PrintProduct.findById(id);

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

// Delete a Print Product
const DeletePrintProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await PrintProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Print Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Print Product Price
// const CalculatePrintProductPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { size, printingSide, paperType, qty, laminationRequired } = req.body;
//     const searchPrintingSide = printingSide === "2 side" ? "1 side" : printingSide;

//     const product = await PrintProduct.findOne({
//       "configurations.size": size,
//       "configurations.printingSide": searchPrintingSide,
//       "configurations.paperTypes.type": paperType,
//     });

//     if (!product) {
//       return next(new AppErr("No matching product configuration found", 404));
//     }

//     const configuration = product.configurations.find(
//       (config) => config.size === size && config.printingSide === searchPrintingSide
//     );

//     const paperConfig = configuration.paperTypes.find((paper) => paper.type === paperType);

//     const costConfig = paperConfig.costConfigurations.find(
//       (cost) =>
//         qty >= parseInt(cost.quantityRange.split("-")[0]) &&
//         qty <= parseInt(cost.quantityRange.split("-")[1])
//     );

//     if (!costConfig) {
//       return next(new AppErr("Quantity out of range", 400));
//     }

//     const basePrice = qty * costConfig.costPerUnit;
//     let laminationCost = 0;

//     if (printingSide === "2 side") {
//       basePrice = basePrice * 2;
//     }

//     if (laminationRequired) {
//       laminationCost = costConfig.laminationCost || 0;
//     }

//     const totalPrice = basePrice + laminationCost;

//     res.status(200).json({
//       status: true,
//       data: { basePrice, laminationCost, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

const CalculatePrintProductPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { size, printingSide, paperType, qty, laminationRequired } = req.body;

    const searchPrintingSide = printingSide === "2 side" ? "1 side" : printingSide;

    // Fetch the product based on the given size, printingSide, and paperType
    const product = await PrintProduct.findOne({
      "configurations.size": size,
      "configurations.printingSide": searchPrintingSide,
      "configurations.paperTypes.type": paperType,
    });

    if (!product) {
      return next(new AppErr("No matching product configuration found", 404));
    }

    // Extract the relevant configuration for the requested size and printing side
    const configuration = product.configurations.find(
      (config) => config.size === size && config.printingSide === searchPrintingSide
    );

    const paperConfig = configuration.paperTypes.find((paper) => paper.type === paperType);

    // Find the appropriate cost configuration based on quantity range
    const costConfig = paperConfig.costConfigurations.find(
      (cost) =>
        qty >= parseInt(cost.quantityRange.split("-")[0]) &&
        qty <= parseInt(cost.quantityRange.split("-")[1])
    );

    if (!costConfig) {
      return next(new AppErr("Quantity out of range", 400));
    }

    // Calculate the base price
    let basePrice = qty * costConfig.costPerUnit;

    // If "2 side" printing is selected, double the base price
    if (printingSide === "2 side") {
      basePrice = basePrice * 2;
    }

    // Set lamination cost as a fixed value for the quantity range
    let laminationCost = 0;

    if (laminationRequired) {
      laminationCost = costConfig.laminationCost || 0; // Use fixed lamination cost
    }

    // Total price calculation
    const totalPrice = basePrice + laminationCost;

    // Send the response
    res.status(200).json({
      status: true,
      data: { basePrice, laminationCost, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



module.exports = {
  CreatePrintProduct,
  UpdatePrintProduct,
  GetAllPrintProducts,
  GetSinglePrintProduct,
  DeletePrintProduct,
  CalculatePrintProductPrice,
};
