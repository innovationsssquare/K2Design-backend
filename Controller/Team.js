// Controller/TeamController.js
const Team = require("../Model/Team");
const AppErr = require("../Services/AppErr");

// Create a new team member
const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, email, phone, location } = req.body;

    const newMember = new Team({
      name,
      role,
      email,
      phone,
      location,
    });

    const savedMember = await newMember.save();

    res.status(201).json({
      status: true,
      statuscode: 201,
      message: "Team member created successfully",
      data: savedMember,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get all team members
const getAllTeamMembers = async (req, res, next) => {
  try {
    const teamMembers = await Team.find();
    res.status(200).json({
      status: true,
      statuscode: 200,
      data: teamMembers,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a specific team member by ID
const getTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await Team.findById(id);

    if (!member) return next(new AppErr("Team member not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      data: member,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update a team member by ID
const updateTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, location } = req.body;

    const updatedMember = await Team.findByIdAndUpdate(
      id,
      { name, role, email, phone, location },
      { new: true, runValidators: true }
    );

    if (!updatedMember) return next(new AppErr("Team member not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Team member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete a team member by ID
const deleteTeamMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMember = await Team.findByIdAndDelete(id);

    if (!deletedMember) return next(new AppErr("Team member not found", 404));

    res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMemberById,
  deleteTeamMemberById,
};
