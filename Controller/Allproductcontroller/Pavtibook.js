const PavatiBook = require("../../Model/Allproductschema/Pavtibook");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Pavati Book
const CreatePavatiBook = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { product, subcategoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await PavatiBook.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newPavatiBook = new PavatiBook({
      product,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newPavatiBook.save();

    res.status(201).json({
      status: true,
      message: "Pavati Book created successfully",
      data: newPavatiBook,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Pavati Book
const UpdatePavatiBook = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await PavatiBook.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return next(new AppErr("Pavati Book not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Pavati Book updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Pavati Books
const GetAllPavatiBooks = async (req, res, next) => {
  try {
    const pavatiBooks = await PavatiBook.find();
    res.status(200).json({
      status: true,
      data: pavatiBooks,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Pavati Book by ID
const GetSinglePavatiBook = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const pavatiBook = await PavatiBook.findById(id);

    if (!pavatiBook) {
      return next(new AppErr("Pavati Book not found", 404));
    }

    res.status(200).json({
      status: true,
      data: pavatiBook,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Pavati Book
const DeletePavatiBook = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedProduct = await PavatiBook.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Pavati Book not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Pavati Book deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Pavati Book Price
const CalculatePavatiBookPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { type, size, pages, qty } = req.body;

    // Find the Pavati book by type, size, and pages
    const pavatiBook = await PavatiBook.findOne({
      "configurations.type": type,
      "configurations.size": size,
      "configurations.pages": pages,
    });

    if (!pavatiBook) {
      return next(new AppErr("Pavati Book with specified configuration not found", 404));
    }

    // Find the specific configuration
    const configuration = pavatiBook.configurations.find(
      (config) => config.type === type && config.size === size && config.pages === pages
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the specified parameters not found", 404));
    }

    // Find the specific quantity option
    const quantityOption = configuration.quantities.find((q) => q.qty === qty);

    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    // Calculate total price
    const totalPrice = quantityOption.costPerUnit * qty;

    // Send the response
    res.status(200).json({
      status: true,
      data: { totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreatePavatiBook,
  UpdatePavatiBook,
  GetAllPavatiBooks,
  GetSinglePavatiBook,
  DeletePavatiBook,
  CalculatePavatiBookPrice,
};
