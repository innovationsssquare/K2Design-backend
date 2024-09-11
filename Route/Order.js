const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  updateOrderById,
} = require("../Controller/Order");

const OrderRouter = express.Router();

OrderRouter.post("/order/create", IsSuperOrAdmin, createOrder);

OrderRouter.get("/order/getall", IsSuperOrAdmin, getAllOrders);

OrderRouter.get("/order/getorder/:id", IsSuperOrAdmin, getOrderById);

OrderRouter.put("/order/update/:id", IsSuperOrAdmin, updateOrderById);

OrderRouter.delete("/order/delete/:id", IsSuperOrAdmin, deleteOrderById);

module.exports = { OrderRouter };
