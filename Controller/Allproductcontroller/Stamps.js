const Stamp = require("../../Model/Allproductschema/Stamps");
const AppErr = require("../../Services/AppErr");

// Create Stamp
const CreateStamp = async (req, res, next) => {
  try {
    const { name, subcategoryId, sku, description, images, configurations } =
      req.body;

    // Check if SKU already exists
    const existingProduct = await Stamp.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newStamp = new Stamp({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newStamp.save();

    res.status(201).json({
      status: true,
      message: "Stamp created successfully",
      data: newStamp,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Stamp Price
const CalculateStampPrice = async (req, res, next) => {
  try {
    const { type, lines, Stampname, qty } = req.body;

    // Find stamp configuration by type
    const stamp = await Stamp.findOne({
      "configurations.Stampname": Stampname,
    });

    if (!stamp) {
      return next(new AppErr("Stamp with specified type not found", 404));
    }

    const configuration = stamp.configurations.find(
      (config) => config.type === type
    );

    if (!configuration) {
      return next(
        new AppErr("Configuration for the specified type not found", 404)
      );
    }

    let basePrice = 0;
    let totalPrice = 0;

    if (lines) {
      const linerate = configuration.lineRates.find(
        (lineRate) => lineRate.lines === lines
      );

      if (!linerate) {
        return next(
          new AppErr("Line rate for the specified number of lines not found", 404)
        );
      }

      basePrice = linerate.rate;
      totalPrice = basePrice * qty;
    } else {
      if (!configuration.fixedRate) {
        return next(
          new AppErr("Fixed rate not available for the specified configuration", 404)
        );
      }

      basePrice = configuration.fixedRate;
      totalPrice = basePrice * qty;
    }


    res.status(200).json({
      status: true,
      data: { basePrice, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Stamps
const GetAllStamps = async (req, res, next) => {
  try {
    const stamps = await Stamp.find();
    res.status(200).json({
      status: true,
      data: stamps,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Stamp
const GetSingleStamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stamp = await Stamp.findById(id);

    if (!stamp) {
      return next(new AppErr("Stamp not found", 404));
    }

    res.status(200).json({
      status: true,
      data: stamp,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Stamp
const UpdateStamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedStamp = await Stamp.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedStamp) {
      return next(new AppErr("Stamp not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Stamp updated successfully",
      data: updatedStamp,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Stamp
const DeleteStamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Stamp.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Stamp not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Stamp deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateStamp,
  CalculateStampPrice,
  GetAllStamps,
  GetSingleStamp,
  UpdateStamp,
  DeleteStamp,
};
