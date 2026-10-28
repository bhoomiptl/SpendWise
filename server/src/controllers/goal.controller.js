const mongoose = require("mongoose");
const Goal = require("../models/Goal");

// Create a new goal
const createGoal = async (req, res) => {
    try {
        const {
            name,
            targetAmountInPaise,
            savedAmountInPaise,
            targetDate,
            description
        } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                message: "Please provide a valid goal name"
            });
        }

        if (
            !Number.isSafeInteger(targetAmountInPaise) ||
            targetAmountInPaise <= 0
        ) {
            return res.status(400).json({
                message: "Target amount must be a positive whole number of paise"
            });
        }

        const savedAmount = savedAmountInPaise ?? 0;

        if (
            !Number.isSafeInteger(savedAmount) ||
            savedAmount < 0
        ) {
            return res.status(400).json({
                message: "Saved amount must be a non-negative whole number of paise"
            });
        }

        if (
            targetDate &&
            (
                typeof targetDate !== "string" ||
                Number.isNaN(Date.parse(targetDate))
            )
        ) {
            return res.status(400).json({
                message: "Please provide a valid target date"
            });
        }

        if (
            description !== undefined &&
            (
                typeof description !== "string" ||
                description.length > 300
            )
        ) {
            return res.status(400).json({
                message: "Description must not exceed 300 characters"
            });
        }

        const goal = await Goal.create({
            userId: req.userId,
            name: name.trim(),
            targetAmountInPaise,
            savedAmountInPaise: savedAmount,
            targetDate: targetDate || null,
            description: description || ""
        });

        return res.status(201).json({
            message: "Goal created successfully",
            goal
        });
    } catch (error) {
        console.error("Create goal error:", error);

        return res.status(500).json({
            message: "Unable to create goal"
        });
    }
};


// Get all goals belonging to the logged-in user
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            goals
        });
    } catch (error) {
        console.error("Get goals error:", error);

        return res.status(500).json({
            message: "Unable to fetch goals"
        });
    }
};


// Get one goal
const getGoal = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid goal ID"
            });
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        return res.status(200).json({
            goal
        });
    } catch (error) {
        console.error("Get goal error:", error);

        return res.status(500).json({
            message: "Unable to fetch goal"
        });
    }
};


// Update a goal
const updateGoal = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid goal ID"
            });
        }

        const {
            name,
            targetAmountInPaise,
            savedAmountInPaise,
            targetDate,
            description
        } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 100
            ) {
                return res.status(400).json({
                    message: "Please provide a valid goal name"
                });
            }

            updates.name = name.trim();
        }

        if (targetAmountInPaise !== undefined) {
            if (
                !Number.isSafeInteger(targetAmountInPaise) ||
                targetAmountInPaise <= 0
            ) {
                return res.status(400).json({
                    message: "Target amount must be a positive whole number of paise"
                });
            }

            updates.targetAmountInPaise = targetAmountInPaise;
        }

        if (savedAmountInPaise !== undefined) {
            if (
                !Number.isSafeInteger(savedAmountInPaise) ||
                savedAmountInPaise < 0
            ) {
                return res.status(400).json({
                    message: "Saved amount must be a non-negative whole number of paise"
                });
            }

            updates.savedAmountInPaise = savedAmountInPaise;
        }

        if (targetDate !== undefined) {
            if (
                targetDate !== null &&
                (
                    typeof targetDate !== "string" ||
                    Number.isNaN(Date.parse(targetDate))
                )
            ) {
                return res.status(400).json({
                    message: "Please provide a valid target date"
                });
            }

            updates.targetDate = targetDate || null;
        }

        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                description.length > 300
            ) {
                return res.status(400).json({
                    message: "Description must not exceed 300 characters"
                });
            }

            updates.description = description;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            });
        }

        const goal = await Goal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        return res.status(200).json({
            message: "Goal updated successfully",
            goal
        });
    } catch (error) {
        console.error("Update goal error:", error);

        return res.status(500).json({
            message: "Unable to update goal"
        });
    }
};


// Delete a goal
const deleteGoal = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid goal ID"
            });
        }

        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!goal) {
            return res.status(404).json({
                message: "Goal not found"
            });
        }

        return res.status(200).json({
            message: "Goal deleted successfully"
        });
    } catch (error) {
        console.error("Delete goal error:", error);

        return res.status(500).json({
            message: "Unable to delete goal"
        });
    }
};


module.exports = {
    createGoal,
    getGoals,
    getGoal,
    updateGoal,
    deleteGoal
};