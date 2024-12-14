const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
    CreateBooklet,
    UpdateBooklet,
    GetAllBooklets,
    GetSingleBooklet,
    DeleteBooklet,
    calculateBookletPrice
} = require("../../Controller/Allproductcontroller/Booklet");

const BookletRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route to create a booklet
BookletRouter.post(
    "/create/Booklet",
    [
        body("name").notEmpty().withMessage("Booklet Name is required"),
        body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
        body("price").isNumeric().withMessage("Price must be a numeric value"),
        body("sku").notEmpty().withMessage("SKU is required"),
        body("images").isArray().withMessage("Images must be an array"),
    ],
    validateRequest,
    // IsSuperAdmin,
    CreateBooklet
);

// Route to calculate booklet price
BookletRouter.post(
    "/calculatePrice",
    [
        body("pageType").notEmpty().withMessage("Page type is required"),
        body("paperType").notEmpty().withMessage("Paper type is required"),
        body("qty").isNumeric().withMessage("Quantity is required and must be numeric"),
    ],
    calculateBookletPrice
);

// Route to update a booklet
BookletRouter.put(
    "/update/Booklet/:id",
    [
        param("id").isMongoId().withMessage("Invalid Booklet ID"),
    ],
    validateRequest,
    IsSuperAdmin,
    UpdateBooklet
);

// Route to get all booklets
BookletRouter.get("/get/Booklet", GetAllBooklets);

// Route to get a single booklet by ID
BookletRouter.get(
    "/get/Booklet/:id",
    [param("id").isMongoId().withMessage("Invalid Booklet ID")],
    validateRequest,
    GetSingleBooklet
);

// Route to delete a booklet by ID
BookletRouter.delete(
    "/delete/Booklet/:id",
    [param("id").isMongoId().withMessage("Invalid Booklet ID")],
    validateRequest,
    DeleteBooklet
);

module.exports = { BookletRouter };
