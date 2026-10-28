const express = require("express");

const {
    createGoal,
    getGoals,
    getGoal,
    updateGoal,
    deleteGoal
} = require("../controllers/goal.controller");

const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Protect every Goals endpoint
router.use(requireAuth);

// Create a goal
router.post("/", createGoal);

// Get all goals
router.get("/", getGoals);

// Get one goal
router.get("/:id", getGoal);

// Update a goal
router.put("/:id", updateGoal);

// Delete a goal
router.delete("/:id", deleteGoal);

module.exports = router;