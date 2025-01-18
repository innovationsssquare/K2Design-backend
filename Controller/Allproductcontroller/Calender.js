const WallCalendar = require("../../Model/Allproductschema/Calender");
const AppErr = require("../../Services/AppErr");

// Create Wall Calendar
const CreateWallCalendar = async (req, res, next) => {
  try {
    const { name, subcategoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await WallCalendar.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newWallCalendar = new WallCalendar({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newWallCalendar.save();

    res.status(201).json({
      status: true,
      message: "Wall Calendar created successfully",
      data: newWallCalendar,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Wall Calendar Price
const CalculateWallCalendarPrice = async (req, res, next) => {
  try {
    const { size, paperType, qty } = req.body;

    // Find wall calendar configuration by size and paper type
    const wallCalendar = await WallCalendar.findOne({
      "configurations.size": size,
      "configurations.paperType": paperType,
    });

    if (!wallCalendar) {
      return next(new AppErr("Wall Calendar with specified size and paper type not found", 404));
    }

    const configuration = wallCalendar.configurations.find(
      (config) => config.size === size && config.paperType === paperType
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the size and paper type not found", 404));
    }

    const quantityOption = configuration.quantities.find((q) => q.qty === qty);
    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    // Calculate total cost
    const totalPrice = quantityOption.costPerUnit * qty;

    res.status(200).json({
      status: true,
      data: { totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Wall Calendars
const GetAllWallCalendars = async (req, res, next) => {
  try {
    const wallCalendars = await WallCalendar.find();
    res.status(200).json({
      status: true,
      data: wallCalendars,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Wall Calendar
const GetSingleWallCalendar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wallCalendar = await WallCalendar.findById(id);

    if (!wallCalendar) {
      return next(new AppErr("Wall Calendar not found", 404));
    }

    res.status(200).json({
      status: true,
      data: wallCalendar,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Wall Calendar
const UpdateWallCalendar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedWallCalendar = await WallCalendar.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedWallCalendar) {
      return next(new AppErr("Wall Calendar not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Wall Calendar updated successfully",
      data: updatedWallCalendar,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Wall Calendar
const DeleteWallCalendar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await WallCalendar.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Wall Calendar not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Wall Calendar deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateWallCalendar,
  CalculateWallCalendarPrice,
  GetAllWallCalendars,
  GetSingleWallCalendar,
  UpdateWallCalendar,
  DeleteWallCalendar,
};
