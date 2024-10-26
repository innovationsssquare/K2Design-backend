// Route/TicketRouter.js
const express = require("express");
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketById,
  deleteTicketById,
} = require("../Controller/Support");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");

const TicketRouter = express.Router();

TicketRouter.post("/ticket/create", createTicket);
TicketRouter.get("/ticket/getall", IsSuperOrAdmin, getAllTickets);
TicketRouter.get("/ticket/get/:id", IsSuperOrAdmin, getTicketById);
TicketRouter.put("/ticket/update/:id", IsSuperOrAdmin, updateTicketById);
TicketRouter.delete("/ticket/delete/:id", IsSuperOrAdmin, deleteTicketById);

module.exports = { TicketRouter };
