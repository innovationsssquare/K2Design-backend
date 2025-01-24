const VisitingCard = require("../../Model/Allproductschema/Visiyingcard");
const { validationResult } = require("express-validator");
const AppErr = require("../../Services/AppErr");

// Utility to validate incoming requests
const validateRequest = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppErr(errors.array()[0].msg, 400));
  }
};

// Create Visiting Card
const CreateVisitingCard = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const {
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      cardType,
      configurations,
    } = req.body;

    // Check if SKU is unique
    const existingCard = await VisitingCard.findOne({ sku });
    if (existingCard) {
      return next(new AppErr("Visiting Card with this SKU already exists", 400));
    }

    const visitingCard = new VisitingCard({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images,
      cardType,
      configurations,
    });

    await visitingCard.save();

    res.status(201).json({
      status: true,
      message: "Visiting Card created successfully",
      data: visitingCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update Visiting Card
const UpdateVisitingCard = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCard = await VisitingCard.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCard) {
      return next(new AppErr("Visiting Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Visiting Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Visiting Cards
const GetAllVisitingCards = async (req, res, next) => {
  try {
    const visitingCards = await VisitingCard.find();
    res.status(200).json({
      status: true,
      data: visitingCards,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get Single Visiting Card by ID
const GetSingleVisitingCard = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const visitingCard = await VisitingCard.findById(id);

    if (!visitingCard) {
      return next(new AppErr("Visiting Card not found", 404));
    }

    res.status(200).json({
      status: true,
      data: visitingCard,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete Visiting Card
const DeleteVisitingCard = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { id } = req.params;
    const deletedCard = await VisitingCard.findByIdAndDelete(id);

    if (!deletedCard) {
      return next(new AppErr("Visiting Card not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Visiting Card deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Visiting Card Price
// const CalculateVisitingCardPrice = async (req, res, next) => {
//   validateRequest(req, next);

//   try {
//     const {material, lamination, qty } = req.body;
//      console.log(req.body)
//     const visitingCard = await VisitingCard.findOne({
//       "configurations.material": material,
//       "configurations.laminationRates": lamination,
//     });

//     console.log(visitingCard)
//     if (!visitingCard) {
//       return next(new AppErr("Card with specified type, material, and lamination not found", 404));
//     }

//     const quantityOption = visitingCard.configurations
//       .flatMap((config) => config.quantities)
//       .find((q) => q.qty === qty);

//     if (!quantityOption) {
//       return next(new AppErr("Invalid quantity selected", 400));
//     }

//     const basePrice = visitingCard.configurations.sideRates.oneSide * qty;
//     const laminationCost = lamination ? quantityOption.laminationCost * qty : 0;

//     const totalPrice = basePrice + laminationCost;

//     res.status(200).json({
//       status: true,
//       data: { basePrice, laminationCost, totalPrice },
//     });
//   } catch (error) {
//     next(new AppErr(error.message, 500));
//   }
// };


const CalculateVisitingCardPrice = async (req, res, next) => {
  validateRequest(req, next);

  try {
    const { material, lamination, uvType, sideType, qty } = req.body;


    // Find the card configuration by material
    const visitingCard = await VisitingCard.findOne({
      "configurations.material": material,
    });


    if (!visitingCard) {
      return next(
        new AppErr("Card with the specified material not found", 404)
      );
    }

    // Find the specific configuration
    const configuration = visitingCard.configurations.find(
      (config) => config.material === material
    );

    if (!configuration) {
      return next(new AppErr("Configuration for the material not found", 404));
    }

    // Calculate individual rates
    let sideRate = 0;
    if (sideType === "twoSide") {
      sideRate =
        configuration.sideRates.oneSide + configuration.sideRates.twoSide;
    } else if (sideType === "oneSide") {
      sideRate = configuration.sideRates.oneSide;
    } else {
      return next(new AppErr("Invalid side type selected", 400));
    }

    // const laminationRate = configuration.laminationRates[lamination] || 0;

    let laminationRate = 0;
    if (lamination === "both") {
      laminationRate =
        (configuration.laminationRates.glossFront || 0) +
        (configuration.laminationRates.glossBack || 0);
    } else {
      laminationRate = configuration.laminationRates[lamination] || 0;
    }

    let uvRate = 0;
    if (uvType === "both") {
      uvRate =
        (configuration.uvRates.uvFront || 0) +
        (configuration.uvRates.uvBack || 0);
    } else {
      uvRate = configuration.uvRates[uvType] || 0
    }

    // const uvRate = configuration.uvRates[uvType] || 0;

    // Validate quantity
    const quantityOption = configuration.quantities.find(
      (q) => q.qty === qty
    );
    if (!quantityOption) {
      return next(new AppErr("Invalid quantity selected", 400));
    }

    // Calculate total cost
    const basePrice = (sideRate + laminationRate + uvRate) * qty;
    const FinalPrice = parseFloat(basePrice.toFixed(2));

    res.status(200).json({
      status: true,
      data: {
        FinalPrice,
      },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};



module.exports = {
  CreateVisitingCard,
  UpdateVisitingCard,
  GetAllVisitingCards,
  GetSingleVisitingCard,
  DeleteVisitingCard,
  CalculateVisitingCardPrice,
};
