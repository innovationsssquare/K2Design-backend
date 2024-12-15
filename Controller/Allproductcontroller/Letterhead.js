const Letterhead = require("../../Model/Allproductschema/Letterhead");
const AppErr = require("../../Services/AppErr");

// Add Letterhead Product
const addLetterheadProduct = async (req, res, next) => {
  try {
    const {
      sku,
      name,
      description,
      images,
      printSide,
      size,
      printing,
      paperType,
      configurations,
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Letterhead.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newLetterhead = new Letterhead({
      sku,
      name,
      description,
      images,
      configurations,
      printSide,
      size,
      printing,
      paperType,
    });

    await newLetterhead.save();

    res.status(201).json({
      status: true,
      message: "Letterhead product added successfully",
      data: newLetterhead,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Letterhead Products
const getAllLetterheads = async (req, res, next) => {
  try {
    const products = await Letterhead.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a Single Letterhead Product
const getSingleLetterhead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Letterhead.findById(id);

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

// Update Letterhead Product
const updateLetterheadProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Letterhead.findByIdAndUpdate(id, updateData, {
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

// Delete Letterhead Product
const deleteLetterheadProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Letterhead.findByIdAndDelete(id);

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

// Calculate Letterhead Price
// const calculateLetterheadPrice = async (req, res, next) => {
//   try {
//     const { size, printingType, paperType, quantity } = req.body;

//     const product = await Letterhead.findOne({
//       "configurations.size": size,
//       "configurations.printingType": printingType,
//       "configurations.paperType": paperType,
//     });

//     if (!product) {
//       return next(new AppErr("No matching product configuration found", 404));
//     }

//     const config = product.configurations.find(
//       (conf) =>
//         conf.size === size &&
//         conf.printingType === printingType &&
//         conf.paperType === paperType
//     );

//     if (!config) {
//       return next(new AppErr("Configuration not found", 400));
//     }

//     const quantityOption = config.quantityOptions.find(
//       (option) => option.quantity === quantity
//     );

//     if (!quantityOption) {
//       return next(new AppErr("Invalid quantity value", 400));
//     }

//     const totalPrice = quantity * quantityOption.costPerUnit;

//     res.status(200).json({
//       status: true,
//       data: { totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

// const calculateLetterheadPrice = async (req, res, next) => {
//     try {
//       const { size, printing, paperType, quantity, bindingType } = req.body;
  
//       // Find the product configuration based on size, printingType, and paperType
//       const product = await Letterhead.findOne({
//         "configurations.size": size,
//         "configurations.printingType": printing,
//         "configurations.paperType": paperType,
//       });
  
//       if (!product) {
//         return next(new AppErr("No matching product configuration found", 404));
//       }
  
//       // Find the matching configuration based on the quantity
//       const config = product.configurations.find(
//         (conf) =>
//           conf.size === size &&
//           conf.printingType === printing &&
//           conf.paperType === paperType
//       );
  
//       if (!config) {
//         return next(new AppErr("Configuration not found", 400));
//       }
  
//       const quantityOption = config.quantityOptions.find(
//         (option) => option.quantity === quantity
//       );
  
//       if (!quantityOption) {
//         return next(new AppErr("Invalid quantity value", 400));
//       }
  
//       // Base Price (quantity * perRate)
//       const basePrice = quantity * quantityOption.perRate;
  
//       // Find the binding option selected by the user
//       const bindingOption = config.bindingCosts[bindingType];
  
//       if (bindingOption === undefined) {
//         return next(new AppErr("Invalid binding type selected", 400));
//       }
  
//       // Total Binding Cost
//       const bindingCost = bindingOption;
  
//       // Final Price (Base Price + Binding Cost)
//       const totalPrice = basePrice + bindingCost;
  
//       res.status(200).json({
//         status: true,
//         data: { totalPrice },
//       });
//     } catch (error) {
//       next(new AppErr(error.message, 500));
//     }
//   };
  
// const calculateLetterheadPrice = async (req, res, next) => {
//     try {
//       const { size, printingType, paperType, quantity, bindingType } = req.body;
  
//       // Ensure product configuration matches the size, printingType, and paperType
//       const product = await Letterhead.findOne({
//         "size": size,
//         "printingType": printingType,   
//         "paperType": paperType, 
//         "configurations.quantityOptions.quantity": quantity,
//       });
  
//       console.log(product)
//       if (!product) {
//         return next(new AppErr("No matching product configuration found", 404));
//       }
  
//       const config = product.configurations.find(
//         (conf) =>
//           conf.size === size &&
//           conf.printingType === printingType &&
//           conf.paperType === paperType
//       );
  
//       if (!config) {
//         return next(new AppErr("Configuration not found", 400));
//       }
  
//       const quantityOption = config.quantityOptions.find(
//         (option) => option.quantity === quantity
//       );
  
//       if (!quantityOption) {
//         return next(new AppErr("Invalid quantity value", 400));
//       }
  
//       const basePrice = quantity * quantityOption.perRate;
  
//       // Find the binding cost for the selected binding type
//       const bindingCost = config.bindingCosts[bindingType];
  
//       if (!bindingCost) {
//         return next(new AppErr("Invalid binding type", 400));
//       }
  
//       // Final Price Calculation (base price + binding cost)
//       const totalPrice = basePrice + bindingCost;
  
//       res.status(200).json({
//         status: true,
//         data: { totalPrice },
//       });
//     } catch (error) {
//       next(new AppErr(error.message, 500));
//     }
//   };
  
const calculateLetterheadPrice = async (req, res, next) => {
    try {
      const { size, printingType, paperType, quantity, bindingType } = req.body;
  
      // Find the product based on size, printingType, and paperType (root level fields)
      const product = await Letterhead.findOne({
        size: size,  // Size is directly in the root schema, not in configurations
        printingType: printingType,  // Printing type is directly in the root schema
        paperType: paperType,  // Paper type is directly in the root schema
      });
  
      if (!product) {
        return next(new AppErr("No matching product configuration found", 404));
      }
  
      // Now find the configuration for the specific quantity in the configurations array
      const config = product.configurations.find(
        (conf) => conf.quantity === quantity
      );
  
      if (!config) {
        return next(new AppErr("Configuration not found for the given quantity", 400));
      }
  
      // Calculate the base price using perRate
      const basePrice = quantity * config.perRate;
  
      // Find the binding cost based on the selected binding type
      const bindingCost = config.bindingCosts[bindingType];
  
      if (bindingCost === undefined) {
        return next(new AppErr("Invalid binding type", 400));
      }
  
      // Final price calculation
      const totalPrice = basePrice + bindingCost;
  
      res.status(200).json({
        status: true,
        data: { totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

module.exports = {
  addLetterheadProduct,
  updateLetterheadProduct,
  getAllLetterheads,
  getSingleLetterhead,
  calculateLetterheadPrice,
  deleteLetterheadProduct,
};
