const ThreeMReflectorPrint = require("../../../Model/Allproductschema/Mediaprinting/3MReflectorPrint");
const AppErr = require("../../../Services/AppErr");

// Create Product
const CreateThreeMReflectorPrint = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await ThreeMReflectorPrint.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new ThreeMReflectorPrint({
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
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
// const CalculateThreeMReflectorPrintPrice = async (req, res, next) => {
//   try {
//     const { type, height, width, rigidSurface } = req.body;
//     const sqft = height * width;

//     const product = await ThreeMReflectorPrint.findOne({
//       "configurations.type": type,
//     });

//     if (!product) {
//       return next(new AppErr("Product with specified type not found", 404));
//     }

//     const configuration = product.configurations.find(
//       (config) => config.type === type
//     );

//     if (!configuration) {
//       return next(new AppErr("Configuration for the specified type not found", 404));
//     }

//     const sizeOption = configuration.sizeRange.find(
//       (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
//     );

//     if (!sizeOption) {
//       return next(new AppErr("Invalid size range selected", 400));
//     }

//     let totalPrice = sizeOption.finalRate * sqft;

//     // If ACP 3mm is selected
//     if (rigidSurface === "ACP 3mm") {
//       const acpRate = configuration.rigidSurfaceRates.find(
//         (rate) => sqft >= rate.startSqFt && sqft <= rate.endSqFt
//       );

//       if (!acpRate) {
//         return next(new AppErr("Invalid ACP size range selected", 400));
//       }

//       totalPrice += acpRate.acpRate * sqft;
//     }

//     res.status(200).json({
//       status: true,
//       data: { sqft, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };


const CalculateThreeMReflectorPrintPrice = async (req, res, next) => {
    try {
      const { type, height, width } = req.body;
      
      // Calculate square footage
      const sqft = height * width;
  
      // Find the product by type
      const product = await ThreeMReflectorPrint.findOne({
        "configurations.type": type,
      });
  
      if (!product) {
        return next(new AppErr("Product with specified type not found", 404));
      }
  
      // Find the specific configuration
      const configuration = product.configurations.find(
        (config) => config.type === type
      );
  
      if (!configuration) {
        return next(new AppErr("Configuration for the specified type not found", 404));
      }
  
      // Find the correct size range for the base product
      const sizeOption = configuration.sizeRange.find(
        (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
      );
       console.log(sizeOption)
      if (!sizeOption) {
        return next(new AppErr("Invalid size range selected", 400));
      }
  
      let totalPrice = sizeOption.finalRate * sqft;
  
      // If "ACP 3mm" is selected, find the corresponding rate and add it to the price
    //   const acpConfig = product.configurations.find((config) => config.type === "ACP 3mm");
      
    //   if (acpConfig) {
    //     const acpSizeOption = acpConfig.sizeRange.find(
    //       (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
    //     );
  
    //     if (acpSizeOption) {
    //       totalPrice += acpSizeOption.finalRate * sqft;
    //     }
    //   }
  
      res.status(200).json({
        status: true,
        data: { sqft, totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

module.exports = {
  CreateThreeMReflectorPrint,
  CalculateThreeMReflectorPrintPrice,
//   GetAllThreeMReflectorPrints,
//   GetSingleThreeMReflectorPrint,
//   UpdateThreeMReflectorPrint,
//   DeleteThreeMReflectorPrint,
};
