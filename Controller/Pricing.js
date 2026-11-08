const { calculateProductPrice, pricingMatrix, normalizeCategory } = require('../Services/PricingEngine/pricingCalculator');
const AppErr = require('../Services/AppErr');

/**
 * Get pricing matrix and schema options for any category
 */
const getPricingOptions = async (req, res, next) => {
  try {
    const { category } = req.params;
    const normalized = normalizeCategory(category);
    if (normalized && pricingMatrix[normalized]) {
      return res.status(200).json({
        status: true,
        data: pricingMatrix[normalized]
      });
    }

    return res.status(200).json({
      status: true,
      data: pricingMatrix
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

/**
 * Universal Quote Calculator Endpoint
 */
const calculatePrice = async (req, res, next) => {
  try {
    const { category, params } = req.body;
    if (!category) {
      return next(new AppErr("Category name is required", 400));
    }

    const calculation = calculateProductPrice(category, params || req.body);
    return res.status(200).json({
      status: true,
      message: "Quote calculated successfully",
      data: calculation
    });
  } catch (err) {
    next(new AppErr(err.message, 400));
  }
};

module.exports = {
  getPricingOptions,
  calculatePrice
};
