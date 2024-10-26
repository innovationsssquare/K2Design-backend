// Controller/TicketController.js
const Ticket = require("../Model/Support");
const AppErr = require("../Services/AppErr");

// Create a new ticket
const createTicket = async (req, res, next) => {
  try {
    const { subject, description, priority } = req.body;

    const newTicket = new Ticket({
      subject,
      description,
      priority,
    });

    const savedTicket = await newTicket.save();

    res.status(201).json({
      status: true,
      statuscode: 201,
      message: "Ticket created successfully",
      data: savedTicket,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get all tickets
const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json({
      status: true,
      statuscode: 200,
      data: tickets,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a specific ticket by ID
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) return next(new AppErr("Ticket not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      data: ticket,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update a ticket by ID
const updateTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, description, status, priority } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { subject, description, status, priority },
      { new: true, runValidators: true }
    );

    if (!updatedTicket) return next(new AppErr("Ticket not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete a ticket by ID
const deleteTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) return next(new AppErr("Ticket not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketById,
  deleteTicketById,
};
