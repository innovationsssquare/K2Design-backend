// Route/TeamRouter.js
const express = require("express");
const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMemberById,
  deleteTeamMemberById,
} = require("../Controller/Team");

const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");

const TeamRouter = express.Router();

TeamRouter.post("/team/create", IsSuperOrAdmin, createTeamMember);
TeamRouter.get("/team/getall", IsSuperOrAdmin, getAllTeamMembers);
TeamRouter.get("/team/get/:id", IsSuperOrAdmin, getTeamMemberById);
TeamRouter.put("/team/update/:id", IsSuperOrAdmin, updateTeamMemberById);
TeamRouter.delete("/team/delete/:id", IsSuperOrAdmin, deleteTeamMemberById);

module.exports = { TeamRouter };
