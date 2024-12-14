const Brochure = require("../../Model/Allproductschema/Brochure");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};


const CreateBrochure = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const {
        name,
        subcategoryId,
        price,
        sku,
        description,
        images,
        quantities,
      } = req.body;
  
      const existingBrochure = await Brochure.findOne({ sku });
      if (existingBrochure) {
        return next(new AppErr("Brochure with this SKU already exists", 400));
      }
  
      const brochure = new Brochure({
        name,
        subcategoryId,
        price,
        sku,
        description,
        images,
        quantities,
      });
  
      await brochure.save();
  
      res.status(201).json({
        status: true,
        message: "Brochure created successfully",
        data: brochure,
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  // Update Brochure
  const UpdateBrochure = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const updatedBrochure = await Brochure.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedBrochure) {
        return next(new AppErr("Brochure not found", 404));
      }
  
      res.status(200).json({
        status: true,
        message: "Brochure updated successfully",
        data: updatedBrochure,
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  // Get All Brochures
  const GetAllBrochure = async (req, res, next) => {
    try {
      const brochures = await Brochure.find();
      res.status(200).json({
        status: true,
        data: brochures,
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  // Get Single Brochure by ID
  const GetSingleBrochure = async (req, res, next) => {
    try {
      const { id } = req.params;
      const brochure = await Brochure.findById(id);
  
      if (!brochure) {
        return next(new AppErr("Brochure not found", 404));
      }
  
      res.status(200).json({
        status: true,
        data: brochure,
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  // Delete Brochure
  const DeleteBrochure = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedBrochure = await Brochure.findByIdAndDelete(id);
  
      if (!deletedBrochure) {
        return next(new AppErr("Brochure not found", 404));
      }
  
      res.status(200).json({
        status: true,
        message: "Brochure deleted successfully",
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  
  // Calculate Brochure Price
//   const calculateBrochurePrice = async (req, res, next) => {
//     validateRequest(req, next);
  
//     try {
//       const { size, paperType, qty } = req.body;
  
//       const brochure = await Brochure.findOne({
//         "quantities.size": size,
//         "quantities.paperType": paperType,
//         "quantities.qty": qty,
//       });
  
//       if (!brochure) {
//         return next(new AppErr("No matching brochure configuration found", 404));
//       }
  
//       const quantityOption = brochure.quantities.find(
//         (q) => q.size === size && q.paperType === paperType && q.qty === qty
//       );
  
//       if (!quantityOption) {
//         return next(new AppErr("Invalid quantity selected", 400));
//       }
  
//       const basePrice = quantityOption.costPerUnit * qty;
//       const laminationCost = quantityOption.laminationCost * qty;
//       const totalPrice = basePrice + laminationCost;
  
//       res.status(200).json({
//         status: true,
//         data: { basePrice, laminationCost, totalPrice },
//       });
//     } catch (error) {
//       next(new AppErr(error.message, 500));
//     }
//   };
  
const calculateBrochurePrice = async (req, res, next) => {
    validateRequest(req, next);
  
    try {
      const { size, paperType, qty, laminationRequired } = req.body;
  
      const brochure = await Brochure.findOne({
        "quantities.size": size,
        "quantities.paperType": paperType,
        "quantities.qty": qty,
      });
  
      if (!brochure) {
        return next(new AppErr("No matching brochure configuration found", 404));
      }
  
      const quantityOption = brochure.quantities.find(
        (q) => q.size === size && q.paperType === paperType && q.qty === qty
      );
  
      if (!quantityOption) {
        return next(new AppErr("Invalid quantity selected", 400));
      }
  
      const basePrice = quantityOption.costPerUnit * qty;
      let laminationCost = 0;
  
      if (laminationRequired) {
        laminationCost = quantityOption.laminationCost * qty;
      }
  
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
    CreateBrochure,
    UpdateBrochure,
    GetAllBrochure,
    GetSingleBrochure,
    DeleteBrochure,
    calculateBrochurePrice,
  };