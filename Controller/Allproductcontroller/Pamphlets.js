const Pamphlet = require("../../Model/Allproductschema/Pamphlets");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Pamphlet
const CreatePamphlet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const {
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      configurations,
    } = req.body;

    // Check if SKU is unique
    const existingPamphlet = await Pamphlet.findOne({ sku });
    if (existingPamphlet) {
      return next(new AppErr("Pamphlet with this SKU already exists", 400));
    }

    const pamphlet = new Pamphlet({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      configurations,
    });

    await pamphlet.save();

    res.status(201).json({
      status: true,
      message: "Pamphlet created successfully",
      data: pamphlet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Pamphlet
const UpdatePamphlet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPamphlet = await Pamphlet.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPamphlet) {
      return next(new AppErr("Pamphlet not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Pamphlet updated successfully",
      data: updatedPamphlet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Pamphlets
const GetAllPamphlets = async (req, res, next) => {
  try {
    const pamphlets = await Pamphlet.find();
    res.status(200).json({
      status: true,
      data: pamphlets,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Pamphlet by ID
const GetSinglePamphlet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const pamphlet = await Pamphlet.findById(id);

    if (!pamphlet) {
      return next(new AppErr("Pamphlet not found", 404));
    }

    res.status(200).json({
      status: true,
      data: pamphlet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Pamphlet
const DeletePamphlet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedPamphlet = await Pamphlet.findByIdAndDelete(id);

    if (!deletedPamphlet) {
      return next(new AppErr("Pamphlet not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Pamphlet deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Pamphlet Price
const CalculatePamphletPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { size, paperType, printingType, qty, twosides } = req.body;

    const pamphlet = await Pamphlet.findOne({
      "configurations.size": size,
    });

    if (!pamphlet) {
      return next(new AppErr("Pamphlet with specified configuration not found", 404));
    }

    const quantityOption = pamphlet.configurations
      .find(
        (config) =>
          config.size === size &&
          config.paperType === paperType &&
          config.printingType === printingType
      )
      .quantities.find((q) => q.qty === qty);

    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    const basePrice = quantityOption.costPerUnit * qty;
    const twosidescost = twosides ? quantityOption.twosidecost * qty : 0;

    const totalPrice = basePrice + twosidescost;

    res.status(200).json({
      status: true,
      data: { basePrice, twosidescost, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreatePamphlet,
  UpdatePamphlet,
  GetAllPamphlets,
  GetSinglePamphlet,
  DeletePamphlet,
  CalculatePamphletPrice,
};
