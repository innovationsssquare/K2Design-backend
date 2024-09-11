const { validationResult } = require("express-validator");
const AppErr = require("../Services/AppErr");
const Customer = require("../Model/User");

// Create a new user
const createUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppErr("Validation errors", 400, errors.array()));
    }

    const { UserName, Address, Email, UserNumber } = req.body;

    const newUser = await Customer.create({
      UserName,
      Address,
      Email,
      UserNumber,
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppErr("Failed to create user", 500, err));
  }
};

// Get a specific user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await Customer.findById(req.params.id);

    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(new AppErr("Failed to fetch user", 500, err));
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await Customer.find();

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    next(new AppErr("Failed to fetch users", 500, err));
  }
};

// Update a user by ID
const updateUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppErr("Validation errors", 400, errors.array()));
    }

    const updatedUser = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // return the updated user
        runValidators: true, // ensure the update respects the schema
      }
    );

    if (!updatedUser) {
      return next(new AppErr("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(new AppErr("Failed to update user", 500, err));
  }
};

// Delete a user by ID
const deleteUserById = async (req, res, next) => {
  try {
    const user = await Customer.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(new AppErr("Failed to delete user", 500, err));
  }
};

module.exports = {
  deleteUserById,
  getUserById,
  updateUserById,
  getAllUsers,
  createUser,
};
