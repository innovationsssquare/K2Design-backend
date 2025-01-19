const InvitationCard = require("../../Model/Allproductschema/Invitation");
const AppErr = require("../../Services/AppErr");

// Create Invitation Card
const CreateInvitationCard = async (req, res, next) => {
  try {
    const { name, subcategoryId, sku, description, images, configurations } = req.body;

    // Check if SKU already exists
    const existingProduct = await InvitationCard.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    // Validate configurations
    for (const config of configurations) {
      if (
        !["6x4", "7x5", "6x9"].includes(config.size)
      ) {
        return next(new AppErr("Invalid configuration data provided", 400));
      }

      for (const quantity of config.quantities) {
        if (typeof quantity.qty !== "number" || typeof quantity.costPerUnit !== "number") {
          return next(new AppErr("Invalid quantities data provided", 400));
        }
      }
    }

    const newInvitationCard = new InvitationCard({
      name,
      subcategoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newInvitationCard.save();

    res.status(201).json({
      status: true,
      message: "Invitation Card created successfully",
      data: newInvitationCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Invitation Card Price
const CalculateInvitationCardPrice = async (req, res, next) => {
    try {
      const { size, qty, twoSided } = req.body; // Include `twoSided` in the request body
  
      // Find invitation card configuration by the provided size
      const invitationCard = await InvitationCard.findOne({
        "configurations.size": size,
      });
  
      if (!invitationCard) {
        return next(
          new AppErr("Invitation Card with specified size not found", 404)
        );
      }
  
      // Find the specific configuration matching the size
      const configuration = invitationCard.configurations.find(
        (config) => config.size === size
      );
  
      if (!configuration) {
        return next(new AppErr("Configuration not found for the given size", 404));
      }
  
      // Find the quantity option within the configuration
      const quantityOption = configuration.quantities.find((q) => q.qty === qty);
      if (!quantityOption) {
        return next(new AppErr("Invalid quantity selected", 400));
      }
  
      // Calculate the total cost
      let costPerUnit = quantityOption.costPerUnit;
      let laminationCost = quantityOption.laminationcost;
  
      // Double the costs if twoSided is true
      if (twoSided) {
        costPerUnit *= 2;
        laminationCost *= 2;
      }
  
      const totalPrice = costPerUnit * qty + laminationCost;
  
      res.status(200).json({
        status: true,
        data: { totalPrice },
      });
    } catch (error) {
      next(new AppErr(error.message, 500));
    }
  };
  

// Get All Invitation Cards
const GetAllInvitationCards = async (req, res, next) => {
  try {
    const invitationCards = await InvitationCard.find();
    res.status(200).json({
      status: true,
      data: invitationCards,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Invitation Card
const GetSingleInvitationCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invitationCard = await InvitationCard.findById(id);

    if (!invitationCard) {
      return next(new AppErr("Invitation Card not found", 404));
    }

    res.status(200).json({
      status: true,
      data: invitationCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Invitation Card
const UpdateInvitationCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedInvitationCard = await InvitationCard.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedInvitationCard) {
      return next(new AppErr("Invitation Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Invitation Card updated successfully",
      data: updatedInvitationCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Invitation Card
const DeleteInvitationCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await InvitationCard.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Invitation Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Invitation Card deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateInvitationCard,
  CalculateInvitationCardPrice,
  GetAllInvitationCards,
  GetSingleInvitationCard,
  UpdateInvitationCard,
  DeleteInvitationCard,
};
