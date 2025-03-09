const StainlessPlate = require("../../../Model/Allproductschema/Rigidsignplates/Stainlesssteelplates");
const AppErr = require("../../../Services/AppErr");

// Create Product
const CreateAcpPlate = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await StainlessPlate.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newProduct = new StainlessPlate({
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
// const CalculateAcpPlatePrice = async (req, res, next) => {
//   try {
//     const { plateType, height, width } = req.body;
//     const sqInch = height * width;

//     // Find the correct product configuration
//     const product = await AcpPlate.findOne({ "configurations.plateType": plateType });

//     if (!product) {
//       return next(new AppErr("Product with specified type not found", 404));
//     }

//     const configuration = product.configurations.find((config) => config.plateType === plateType);
//    console.log(configuration)
//     if (!configuration) {
//       return next(new AppErr("Configuration for the specified type not found", 404));
//     }

//     // Find the correct size range
//     const sizeOption = configuration.rates.sizeRange.find(
//       (range) => sqInch >= range.start && sqInch <= range.end
//     );

//     if (!sizeOption) {
//       return next(new AppErr("Invalid size range selected", 400));
//     }

//     // Calculate total price
//     const totalPrice = sizeOption.finalRate * sqInch;

//     res.status(200).json({
//       status: true,
//       data: { sqInch, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };
const CalculateAcpPlatePrice = async (req, res, next) => {
  try {
    const { plateType, height, width } = req.body;
    const sqInch = height * width;

    // Find the correct product configuration
    const product = await StainlessPlate.findOne({ "configurations.plateType": plateType });

    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.plateType === plateType);

    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    // Find the correct rate object
    const rate = configuration.rates.find(
      (rate) => sqInch >= rate.sizeRange.start && sqInch <= rate.sizeRange.end
    );

    if (!rate) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    // Calculate total price
    const totalPrice = rate.finalRate * sqInch;

    res.status(200).json({
      status: true,
      data: { sqInch, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};




// Get All Products
const GetAllAcpPlates = async (req, res, next) => {
  try {
    const products = await StainlessPlate.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Product
const GetSingleAcpPlate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await StainlessPlate.findById(id);

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

// Update Product
const UpdateAcpPlate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await StainlessPlate.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Product not found", 404));
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

// Delete Product
const DeleteAcpPlate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await StainlessPlate.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateAcpPlate,
  CalculateAcpPlatePrice,
  GetAllAcpPlates,
  GetSingleAcpPlate,
  UpdateAcpPlate,
  DeleteAcpPlate,
};
