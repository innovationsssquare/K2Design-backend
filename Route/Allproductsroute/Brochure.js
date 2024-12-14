const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
    CreateBrochure,
    UpdateBrochure,
    GetAllBrochure,
    GetSingleBrochure,
    DeleteBrochure,
    calculateBrochurePrice
} = require("../../Controller/Allproductcontroller/Brochure");

const BrochureRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route to create a brochure
BrochureRouter.post(
    "/create/Brochure",
    [
        body("name").notEmpty().withMessage("Brochure Name is required"),
        body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
        body("price").isNumeric().withMessage("Price must be a numeric value"),
     
    ],
    validateRequest,
    // IsSuperAdmin,
    CreateBrochure
);

// Route to calculate brochure price
BrochureRouter.post(
    "/calculatePrice",
    [
      body("size").notEmpty().withMessage("Size is required"),
      body("paperType").notEmpty().withMessage("Paper type is required"),
      body("qty").isNumeric().withMessage("Quantity is required and must be numeric"),
    ],
    calculateBrochurePrice
  );

// Route to update a brochure
BrochureRouter.put(
    "/update/Brochure/:id",
    [
        param("id").isMongoId().withMessage("Invalid Brochure ID"),
      
    ],
    validateRequest,
    IsSuperAdmin,
    UpdateBrochure
);

// Route to get all brochures
BrochureRouter.get("/get/Brochure", GetAllBrochure);

// Route to get a single brochure by ID
BrochureRouter.get(
    "/get/Brochure/:id",
    [param("id").isMongoId().withMessage("Invalid Brochure ID")],
    validateRequest,
    GetSingleBrochure
);

// Route to delete a brochure by ID
BrochureRouter.delete(
    "/delete/Brochure/:id",
    [param("id").isMongoId().withMessage("Invalid Brochure ID")],
    validateRequest,
    DeleteBrochure
);

module.exports = { BrochureRouter };
