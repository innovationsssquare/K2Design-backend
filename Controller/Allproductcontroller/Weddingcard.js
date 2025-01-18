const WeddingCard = require("../../Model/Allproductschema/Weddingcard");
const AppErr = require("../../Services/AppErr");

// Create Wedding Card
const CreateWeddingCard = async (req, res, next) => {
  try {
    const { name, subcategoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await WeddingCard.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newWeddingCard = new WeddingCard({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newWeddingCard.save();

    res.status(201).json({
      status: true,
      message: "Wedding Card created successfully",
      data: newWeddingCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Wedding Card Price
const CalculateWeddingCardPrice = async (req, res, next) => {
  try {
    const { size, paperType, sides, qty, includeLamination, includeEnvelope } = req.body;

    // Find wedding card configuration by size and paper type
    const weddingCard = await WeddingCard.findOne({
      "configurations.size": size,
      "configurations.paperType": paperType,
    });

    if (!weddingCard) {
      return next(new AppErr("Wedding Card with specified size and paper type not found", 404));
    }

    const configuration = weddingCard.configurations.find(
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
    const baseRate = quantityOption.baseRate;
    const laminationCost = includeLamination ? quantityOption.laminationCost || 0 : 0;
    const envelopeCost = includeEnvelope ? quantityOption.envelopeCost || 0 : 0;

    const totalRatePerUnit = baseRate + laminationCost + envelopeCost;
    const totalPrice = totalRatePerUnit * qty;

    res.status(200).json({
      status: true,
      data: {
        baseRate,
        laminationCost,
        envelopeCost,
        totalRatePerUnit,
        totalPrice,
      },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Wedding Cards
const GetAllWeddingCards = async (req, res, next) => {
  try {
    const weddingCards = await WeddingCard.find();
    res.status(200).json({
      status: true,
      data: weddingCards,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Wedding Card
const GetSingleWeddingCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const weddingCard = await WeddingCard.findById(id);

    if (!weddingCard) {
      return next(new AppErr("Wedding Card not found", 404));
    }

    res.status(200).json({
      status: true,
      data: weddingCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Wedding Card
const UpdateWeddingCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedWeddingCard = await WeddingCard.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedWeddingCard) {
      return next(new AppErr("Wedding Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Wedding Card updated successfully",
      data: updatedWeddingCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Wedding Card
const DeleteWeddingCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await WeddingCard.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Wedding Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Wedding Card deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateWeddingCard,
  CalculateWeddingCardPrice,
  GetAllWeddingCards,
  GetSingleWeddingCard,
  UpdateWeddingCard,
  DeleteWeddingCard,
};
