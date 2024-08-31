const Subcategory = require('../Model/Subcategories');
const Category= require("../Model/Category ")
const AppErr = require('../Services/AppErr'); 
const slugify = require('slugify');
const Methods = require("../Services/GlobalMethod/Method");
const Api = new Methods();

const createSubcategory = async (req, res, next) => {
  try {
    const { name, description, categoryId } = req.body;

    // Validate category existence
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new AppErr('Category not found', 404));
    }

    // Check for existing subcategory
    const existingSubcategory = await Subcategory.findOne({ name, categoryId });
    if (existingSubcategory) {
      return next(new AppErr('Subcategory already exists in this category', 400));
    }

    // Create subcategory
    const newSubcategory = new Subcategory({
      name,
      description,
      categoryId,
    });

    await newSubcategory.save();

    // Update category's subcategories array
    category.subcategories.push(newSubcategory._id);
    await category.save();

    return res.status(201).json({
      status: true,
      statuscode: 201,
      message: 'Subcategory created successfully',
      data: newSubcategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};



// getall

const getAllSubcategories = async (req, res, next) => {
  try {
    const subcategories = await Subcategory.find().populate('products');
    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: subcategories,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

  
//   getsingle
const getSubcategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id).populate('products');
    if (!subcategory) {
      return next(new AppErr('Subcategory not found', 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: subcategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

  
//   update
const updateSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the subcategory to be updated
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return next(new AppErr('Subcategory not found', 404));
    }

    // Update fields
    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;

    // Update slug if the name has changed
    if (name) {
      subcategory.slug = slugify(name, { lower: true });
    }

    const updatedSubcategory = await subcategory.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};


  

//   delete

const deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete subcategory
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return next(new AppErr('Subcategory not found', 404));
    }

    // Remove subcategory reference from category
    await Category.findByIdAndUpdate(subcategory.categoryId, {
      $pull: { subcategories: subcategory._id },
    });

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: 'Subcategory deleted successfully',
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

  
module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory
};
