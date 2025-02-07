const express = require("express");
const { body, param, validationResult } = require("express-validator");
// const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
    CreateVinylPrint,
    UpdateVinylPrint,
    GetAllVinylPrints,
    GetSingleVinylPrint,
    DeleteVinylPrint,
    CalculateVinylPrintPrice
} = require("../../../Controller/Allproductcontroller/Mediaprinting/Vinylprint");

const VinylPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route to create a Vinyl Print
VinylPrintRouter.post(
    "/create/VinylPrint",
    [
        body("name").notEmpty().withMessage("Vinyl Print Name is required"),
        body("categoryId").notEmpty().withMessage("Category ID is required"),
        body("sku").notEmpty().withMessage("SKU is required"),
        body("images").isArray().withMessage("Images must be an array"),
        body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    ],
    validateRequest,
    CreateVinylPrint
);

// Route to calculate Vinyl Print price
VinylPrintRouter.post(
    "/calculatePrice",
    [
        body("rigidSurface").notEmpty().withMessage("Rigid Surface is required"),
    ],
    validateRequest,
    CalculateVinylPrintPrice
);

// Route to update a Vinyl Print
VinylPrintRouter.put(
    "/update/VinylPrint/:id",
    [param("id").isMongoId().withMessage("Invalid Vinyl Print ID")],
    validateRequest,
    UpdateVinylPrint
);

// Route to get all Vinyl Prints
VinylPrintRouter.get("/get/VinylPrints", GetAllVinylPrints);

// Route to get a single Vinyl Print by ID
VinylPrintRouter.get(
    "/get/VinylPrint/:id",
    [param("id").isMongoId().withMessage("Invalid Vinyl Print ID")],
    validateRequest,
    GetSingleVinylPrint
);

// Route to delete a Vinyl Print by ID
VinylPrintRouter.delete(
    "/delete/VinylPrint/:id",
    [param("id").isMongoId().withMessage("Invalid Vinyl Print ID")],
    validateRequest,
    DeleteVinylPrint
);

module.exports = { VinylPrintRouter };
