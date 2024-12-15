const Envelope = require("../../Model/Allproductschema/Envolopes");
const AppErr = require("../../Services/AppErr");

// Add Envelope Product
const addEnvelopeProduct = async (req, res, next) => {
  try {
    const { sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await Envelope.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newEnvelope = new Envelope({
      sku,
      description,
      images,
      configurations,
    });

    await newEnvelope.save();

    res.status(201).json({
      status: true,
      message: "Envelope product added successfully",
      data: newEnvelope,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

const getAllEnvelopes = async (req, res, next) => {
  try {
    const products = await Envelope.find();
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

const getSingleEnvelope = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Envelope.findById(id);

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

const updateEnvelopeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Envelope.findByIdAndUpdate(id, updateData, {
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

const deleteEnvelopeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Envelope.findByIdAndDelete(id);

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

const calculateEnvelopePrice = async (req, res, next) => {
  try {
    const { size, printingType, paperType, quantity } = req.body;

    const product = await Envelope.findOne({
      "configurations.size": size,
      "configurations.printingType": printingType,
      "configurations.paperType": paperType,
    });

    if (!product) {
      return next(new AppErr("No matching product configuration found", 404));
    }

    const config = product.configurations.find(
      (conf) =>
        conf.size === size &&
        conf.printingType === printingType &&
        conf.paperType === paperType
    );

    if (!config) {
      return next(new AppErr("Configuration not found", 400));
    }

    const quantityOption = config.quantityOptions.find(
      (option) => option.quantity === quantity
    );

    if (!quantityOption) {
      return next(new AppErr("Invalid quantity value", 400));
    }

    const totalPrice = quantity * quantityOption.costPerUnit;

    res.status(200).json({
      status: true,
      data: { totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  addEnvelopeProduct,
  updateEnvelopeProduct,
  getAllEnvelopes,
  getSingleEnvelope,
  calculateEnvelopePrice,
  deleteEnvelopeProduct,
};
