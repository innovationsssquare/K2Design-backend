const express = require('express');
const { getPricingOptions, calculatePrice } = require('../Controller/Pricing');

const PricingRouter = express.Router();

// Get options/slabs for a category (e.g. /api/v1/pricing/options/visitingCards or all)
PricingRouter.get('/options/:category?', getPricingOptions);

// Universal live quote calculation
PricingRouter.post('/calculate', calculatePrice);

module.exports = { PricingRouter };

