const Tag = require("../../Model/Allproductschema/Tag");
const AppErr = require("../../Services/AppErr");

// Create a Tag
const CreateTag = async (req, res, next) => {
  try {
    const {
      product,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    } = req.body;

    // Check if SKU already exists
    const existingTag = await Tag.findOne({ sku });
    if (existingTag) {
      return next(new AppErr("Tag with the specified SKU already exists", 400));
    }

    const newTag = new Tag({
      product,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newTag.save();

    res.status(201).json({
      status: true,
      message: "Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Tag Price
const CalculateTagPrice = async (req, res, next) => {
  try {
    const { paperType, lamination, sideType, qty, extraOptions } = req.body;

    // Find the tag configuration by paperType
    const tag = await Tag.findOne({
      "configurations.paperType": paperType,
    });

    if (!tag) {
      return next(new AppErr("Tag with the specified paper type not found", 404));
    }

    // Find the specific configuration
    const configuration = tag.configurations.find(
      (config) => config.paperType === paperType
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the paper type not found", 404));
    }
   console.log(configuration)
    // Calculate side rates
    let sideRate = 0;
    if (sideType === "twoSide") {
      sideRate = configuration.sideRates.oneSide + configuration.sideRates.twoSide;
    } else if (sideType === "oneSide") {
      sideRate = configuration.sideRates.oneSide;
    } else {
      return next(new AppErr("Invalid side type selected", 400));
    }

    // Calculate lamination rates
    let laminationRate = 0;
    if (sideType === "twoSide") {
      laminationRate = configuration.laminationRates.glossFront + configuration.laminationRates.glossBack;
    } else if (lamination === "glossFront") {
      laminationRate = configuration.laminationRates.glossFront;
    } else if (lamination === "glossBack") {
      laminationRate = configuration.laminationRates.glossBack;
    } else {
      laminationRate = 0; // Default if no lamination provided
    }
console.log(laminationRate,sideRate)
    // Find the quantity option
    const quantityOption = configuration.quantities.find((q) => q.qty === qty);
    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    // Calculate base price
    const basePrice = (sideRate + laminationRate) * qty;

    // Add extra costs for additional options
    let extraCost = 0;
    if (extraOptions?.stringWithHole) {
      extraCost += 1 * qty;
    }
    if (extraOptions?.perforation) {
      extraCost += 0.05 * qty;
    }

    // Final total price
    const FinalPrice = parseFloat((basePrice + extraCost).toFixed(2));

    res.status(200).json({
      status: true,
      data: { FinalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};





// Get All Tags
const GetAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      status: true,
      data: tags,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Tag
const GetSingleTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      return next(new AppErr("Tag not found", 404));
    }

    res.status(200).json({
      status: true,
      data: tag,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Tag
const UpdateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedTag = await Tag.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTag) {
      return next(new AppErr("Tag not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Tag updated successfully",
      data: updatedTag,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Tag
const DeleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);
    if (!deletedTag) {
      return next(new AppErr("Tag not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateTag,
  CalculateTagPrice,
  GetAllTags,
  GetSingleTag,
  UpdateTag,
  DeleteTag,
};
