const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
    CreatePamphlet,
    UpdatePamphlet,
    GetAllPamphlets,
    GetSinglePamphlet,
    DeletePamphlet,
    CalculatePamphletPrice,
} = require("../../Controller/Allproductcontroller/Pamphlets");

const PamphletRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route to create a pamphlet
PamphletRouter.post(
    "/create/Pamphlet",
    [
        body("name").notEmpty().withMessage("Pamphlet name is required"),
        body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
        body("price").isNumeric().withMessage("Price must be a numeric value"),
        body("sku").notEmpty().withMessage("SKU is required"),
        body("images").isArray().withMessage("Images must be an array"),
    ],
    validateRequest,
    CreatePamphlet
);

// Route to calculate pamphlet price
PamphletRouter.post(
    "/calculatePrice",
    [
        body("size").notEmpty().withMessage("Size is required"),
        body("qty").isNumeric().withMessage("Quantity is required and must be numeric"),
    ],
    validateRequest,
    CalculatePamphletPrice
);

// Route to update a pamphlet
PamphletRouter.put(
    "/update/Pamphlet/:id",
    [
        param("id").isMongoId().withMessage("Invalid Pamphlet ID"),
        body("name").optional().notEmpty().withMessage("Pamphlet name must not be empty"),
        body("price").optional().isNumeric().withMessage("Price must be numeric"),
    ],
    validateRequest,
    IsSuperAdmin,
    UpdatePamphlet
);

// Route to get all pamphlets
PamphletRouter.get("/get/Pamphlet", GetAllPamphlets);

// Route to get a single pamphlet by ID
PamphletRouter.get(
    "/get/Pamphlet/:id",
    [param("id").isMongoId().withMessage("Invalid Pamphlet ID")],
    validateRequest,
    GetSinglePamphlet
);

// Route to delete a pamphlet by ID
PamphletRouter.delete(
    "/delete/Pamphlet/:id",
    [param("id").isMongoId().withMessage("Invalid Pamphlet ID")],
    validateRequest,
    IsSuperAdmin,
    DeletePamphlet
);

module.exports = { PamphletRouter };
