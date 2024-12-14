const Booklet = require("../../Model/Allproductschema/Booklet");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Booklet
const CreateBooklet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const {
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      paperType,
      size,
      configurations,
    } = req.body;

    // Check if SKU is unique
    const existingBooklet = await Booklet.findOne({ sku });
    if (existingBooklet) {
      return next(new AppErr("Booklet with this SKU already exists", 400));
    }

    const booklet = new Booklet({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      paperType,
      size,
      configurations,
    });

    await booklet.save();

    res.status(201).json({
      status: true,
      message: "Booklet created successfully",
      data: booklet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Booklet
const UpdateBooklet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBooklet = await Booklet.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooklet) {
      return next(new AppErr("Booklet not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Booklet updated successfully",
      data: updatedBooklet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Booklets
const GetAllBooklets = async (req, res, next) => {
  try {
    const booklets = await Booklet.find();
    res.status(200).json({
      status: true,
      data: booklets,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Booklet by ID
const GetSingleBooklet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const booklet = await Booklet.findById(id);

    if (!booklet) {
      return next(new AppErr("Booklet not found", 404));
    }

    res.status(200).json({
      status: true,
      data: booklet,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Booklet
const DeleteBooklet = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedBooklet = await Booklet.findByIdAndDelete(id);

    if (!deletedBooklet) {
      return next(new AppErr("Booklet not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Booklet deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Booklet Price
// const calculateBookletPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { paperType, pageType, qty, lamination } = req.body;
//     console.log(paperType,pageType,qty,)
//     const booklet = await Booklet.findOne( { paperType: "300 gsm", pageType: "A4" });
    
//     if (!booklet) {
//       return next(new AppErr("Booklet with specified paper type and size not found", 404));
//     }

//     const quantityOption = booklet.quantities.find((q) => q.qty === qty);

//     if (!quantityOption) {
//       return next(new AppErr("Invalid quantity selected", 400));
//     }

//     const basePrice = quantityOption.costPerUnit * qty;
//     const laminationCost = lamination ? quantityOption.laminationCost * qty : 0;

//     const totalPrice = basePrice + laminationCost;

//     res.status(200).json({
//       status: true,
//       data: { basePrice, laminationCost, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };
// const calculateBookletPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const { paperType, pageType, qty, lamination } = req.body;

//     console.log("Request data:", { paperType, pageType, qty });

//     const booklet = await Booklet.findOne({
//       "configurations.paperType": paperType,
//       "configurations.pageType": pageType,
//     });

//     if (!booklet) {
//       return next(new AppErr("Booklet with specified paper type and page type not found", 404));
//     }

//     const quantityOption = booklet.configurations
//       .flatMap((config) => config.quantities)
//       .find((q) => q.qty === qty);

//     if (!quantityOption) {
//       return next(new AppErr("Invalid quantity selected", 400));
//     }

//     const basePrice = quantityOption.costPerUnit * qty;
//     const laminationCost = lamination ? quantityOption.laminationCost * qty : 0;

//     const totalPrice = basePrice + laminationCost;

//     res.status(200).json({
//       status: true,
//       data: { basePrice, laminationCost, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };

const calculateBookletPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { size, paperType, pageType, qty, lamination } = req.body;

    const booklet = await Booklet.findOne({
      "configurations.size": size,
      "configurations.paperType": paperType,
      "configurations.pageType": pageType,
    });

    if (!booklet) {
      return next(new AppErr("Booklet with specified size, paper type, and page type not found", 404));
    }

    const quantityOption = booklet.configurations
      .find((config) => config.size === size && config.paperType === paperType && config.pageType === pageType)
      .quantities.find((q) => q.qty === qty);

    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    const basePrice = quantityOption.costPerUnit * qty;
    const laminationCost = lamination ? quantityOption.laminationCost * qty : 0;

    const totalPrice = basePrice + laminationCost;

    res.status(200).json({
      status: true,
      data: { basePrice, laminationCost, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



module.exports = {
  CreateBooklet,
  UpdateBooklet,
  GetAllBooklets,
  GetSingleBooklet,
  DeleteBooklet,
  calculateBookletPrice,
};
