const BillBook = require("../../Model/Allproductschema/Billbooks");
const AppErr = require("../../Services/AppErr");

// Create Bill Book
const CreateBillBook = async (req, res, next) => {
  try {
    const { name, subcategoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await BillBook.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newBillBook = new BillBook({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newBillBook.save();

    res.status(201).json({
      status: true,
      message: "Bill Book created successfully",
      data: newBillBook,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Bill Book Price
const CalculateBillBookPrice = async (req, res, next) => {
  try {
    const { type, size, orientation, qty } = req.body;

    // Find bill book configuration by type, size, and orientation
    const billBook = await BillBook.findOne({
      "configurations.type": type,
      "configurations.size": size,
      "configurations.orientation": orientation,
    });

    if (!billBook) {
      return next(new AppErr("Bill Book with specified configuration not found", 404));
    }

    const configuration = billBook.configurations.find(
      (config) =>
        config.type === type &&
        config.size === size &&
        config.orientation === orientation
    );

    if (!configuration) {
      return next(new AppErr("Configuration not found", 404));
    }

    const quantityOption = configuration.quantities.find((q) => q.qty === qty);
    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    // Calculate total cost
    const totalPrice = quantityOption.costPerUnit * qty;

    res.status(200).json({
      status: true,
      data: { totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Bill Books
const GetAllBillBooks = async (req, res, next) => {
  try {
    const billBooks = await BillBook.find();
    res.status(200).json({
      status: true,
      data: billBooks,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Bill Book
const GetSingleBillBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const billBook = await BillBook.findById(id);

    if (!billBook) {
      return next(new AppErr("Bill Book not found", 404));
    }

    res.status(200).json({
      status: true,
      data: billBook,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Bill Book
const UpdateBillBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBillBook = await BillBook.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedBillBook) {
      return next(new AppErr("Bill Book not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Bill Book updated successfully",
      data: updatedBillBook,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Bill Book
const DeleteBillBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await BillBook.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Bill Book not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Bill Book deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateBillBook,
  CalculateBillBookPrice,
  GetAllBillBooks,
  GetSingleBillBook,
  UpdateBillBook,
  DeleteBillBook,
};
