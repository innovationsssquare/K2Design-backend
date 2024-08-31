const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin"); 
const { body } = require("express-validator");

const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory
} = require("../Controller/Subcategory");


const SubcategoryRouter = express.Router();

// Create Subcategory
SubcategoryRouter.post(
  "/create/subcategory",
  body("name").notEmpty().withMessage("Subcategory name is required"),
  body("categoryId").notEmpty().withMessage("category name is required"),
  IsSuperOrAdmin,
  createSubcategory
);

// Get All Subcategories
SubcategoryRouter.get("/get/subcategories", getAllSubcategories);

// Get Single Subcategory by ID
SubcategoryRouter.get("/get/subcategory/:id", getSubcategoryById);

// Update Subcategory
SubcategoryRouter.put(
  "/update/subcategory/:id",
  body("name").notEmpty().withMessage("Subcategory name is required"),
  body("description").optional(),
  IsSuperOrAdmin,
  updateSubcategory
);

// Delete Subcategory
SubcategoryRouter.delete("/delete/subcategory/:id", IsSuperOrAdmin, deleteSubcategory);

module.exports = {SubcategoryRouter};
