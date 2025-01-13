const FilesAndFolders = require("../../Model/Allproductschema/Filesandfolders");
const AppErr = require("../../Services/AppErr");

// 1. Add Files & Folders Product
const addFilesAndFoldersProduct = async (req, res, next) => {
  try {
    const { sku, description, images, configurations } = req.body;

    // Check if the SKU already exists
    const existingProduct = await FilesAndFolders.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new FilesAndFolders({
      sku,
      description,
      images,
      configurations,
    });

    await newProduct.save();

    res.status(201).json({
      status: true,
      message: "Files & Folders product added successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// 2. Fetch All Files & Folders Products
const getAllFilesAndFolders = async (req, res, next) => {
  try {
    const products = await FilesAndFolders.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// 3. Calculate Price for a Product Configuration
// const calculateFilesAndFoldersPrice = async (req, res, next) => {
//   try {
//     const {
//       productType,
//       paperType,
//       size,
//       quantity,
//       glossLamination,
//       mattLamination,
//       mattSpotUV,
//       innerSidePrinting,
//     } = req.body;

//     // Find product by configuration
//     const product = await FilesAndFolders.findOne({
//       "configurations.productType": productType,
//       "configurations.paperType": paperType,
//       "configurations.size": size,
//     });

//     if (!product) {
//       return next(new AppErr("No matching product configuration found", 404));
//     }

//     // Find the matching configuration
//     const config = product.configurations.find(
//       (conf) =>
//         conf.productType === productType &&
//         conf.paperType === paperType &&
//         conf.size === size
//     );

//     if (!config) {
//       return next(new AppErr("Configuration not found", 400));
//     }

//     // Find quantity option
//     const quantityOption = config.quantityOptions.find(
//       (option) => option.quantity === quantity
//     );

//     if (!quantityOption) {
//       return next(new AppErr("Invalid quantity value", 400));
//     }

//     // Base cost calculation
//     const basePrice = quantity * quantityOption.costPerUnit;

//     // Extra cost calculation
//     let extraCost = 0;
//     if (glossLamination) extraCost += quantityOption.extraCosts.glossLamination;
//     if (mattLamination) extraCost += quantityOption.extraCosts.mattLamination;
//     if (mattSpotUV) extraCost += quantityOption.extraCosts.mattSpotUV;
//     if (innerSidePrinting) extraCost += quantityOption.extraCosts.innerSideCost;

//     // Total price
//     const totalPrice = basePrice + extraCost;

//     res.status(200).json({
//       status: true,
//       data: {
//         basePrice,
//         extraCost,
//         totalPrice,
//       },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

const calculateFilesAndFoldersPrice = async (req, res, next) => {
  try {
    const {
      productType,
      paperType,
      size,
      quantity,
      glossLamination,
      mattLamination,
      mattSpotUV,
      innerSidePrinting,
    } = req.body;

    // Find product by configuration
    const product = await FilesAndFolders.findOne({
      "configurations.productType": productType,
      "configurations.paperType": paperType,
      "configurations.size": size,
    });

    if (!product) {
      return next(new AppErr("No matching product configuration found", 404));
    }

    // Find the matching configuration
    const config = product.configurations.find(
      (conf) =>
        conf.productType === productType &&
        conf.paperType === paperType &&
        conf.size === size
    );

    if (!config) {
      return next(new AppErr("Configuration not found", 400));
    }

    // Find quantity option
    const quantityOption = config.quantityOptions.find(
      (option) => option.quantity === quantity
    );

    if (!quantityOption) {
      return next(new AppErr("Invalid quantity value", 400));
    }

    // Base cost calculation
    const basePrice = quantity * quantityOption.costPerUnit;

    // Extra cost calculation (multiplied by quantity)
    let extraCost = 0;
    if (glossLamination) extraCost += quantity * quantityOption.extraCosts.glossLamination;
    if (mattLamination) extraCost += quantity * quantityOption.extraCosts.mattLamination;
    if (mattSpotUV) extraCost += quantity * quantityOption.extraCosts.mattSpotUV;
    if (innerSidePrinting) extraCost += quantity * quantityOption.extraCosts.innerSideCost;

    // Total price
    const totalPrice = basePrice + extraCost;

    res.status(200).json({
      status: true,
      data: {
        basePrice,
        extraCost,
        totalPrice,
      },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};


const getSingleFilesAndFolders = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await FileProduct.findById(id);

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

// Update Files & Folders Product
const updateFilesAndFoldersProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await FileProduct.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Product not found or update failed", 404));
    }

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Files & Folders Product
const deleteFilesAndFoldersProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await FileProduct.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Product not found or deletion failed", 404));
    }

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};




module.exports = {
  addFilesAndFoldersProduct,
  getAllFilesAndFolders,
  calculateFilesAndFoldersPrice,
  getSingleFilesAndFolders,
  updateFilesAndFoldersProduct,
  deleteFilesAndFoldersProduct
};
