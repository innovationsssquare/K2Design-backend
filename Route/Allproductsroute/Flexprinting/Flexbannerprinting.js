const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  //   CreateFlexBanner,
  //   UpdateFlexBanner,
  //   GetAllFlexBanners,
  //   GetSingleFlexBanner,
  //   DeleteFlexBanner,
  //   CalculateFlexBannerPrice,
  CreateFlexBanner,
  GetAllFlexBanners,
  CalculateFlexBannerPrice,
} = require("../../../Controller/Allproductcontroller/Flexprinting/Flexbannerprinting");

const flexbannerrouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes for Flex Banner Printing
flexbannerrouter.post("/create/FlexBanner", validateRequest, CreateFlexBanner);
// flexbannerrouter.put(
//   "/update/FlexBanner/:id",
//   validateRequest,
//   UpdateFlexBanner
// );
flexbannerrouter.get("/get/FlexBanner", GetAllFlexBanners);
// flexbannerrouter.get(
//   "/get/FlexBanner/:id",
//   validateRequest,
//   GetSingleFlexBanner
// );
// flexbannerrouter.delete(
//   "/delete/FlexBanner/:id",
//   validateRequest,
//   DeleteFlexBanner
// );
flexbannerrouter.post(
  "/calculatePrice/FlexBanner",
  validateRequest,
  CalculateFlexBannerPrice
);

module.exports = { flexbannerrouter };
