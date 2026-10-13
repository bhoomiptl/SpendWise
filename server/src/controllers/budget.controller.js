const mongoose = require("mongoose");

const Budget = require("../models/Budget");
const Category = require("../models/Category");

const createBudget = async (req, res) => {
    try {
        const {
            categoryId,
            amountInPaise,
            periodStart,
            periodEnd
        } = req.body;

        if (
            amountInPaise === undefined ||
            !periodStart ||
            !periodEnd
        ) {
            return res.status(400).json({
                message: "Amount, period start and period end are required"
            });
        }

        if (
            !Number.isInteger(amountInPaise) ||
            amountInPaise <= 0
        ) {
            return res.status(400).json({
                message: "Budget amount must be a positive whole number of paise"
            });
        }

        const start = new Date(periodStart);
        const end = new Date(periodEnd);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid budget period"
            });
        }

        if (start >= end) {
            return res.status(400).json({
                message: "Period end must be after period start"
            });
        }

        if (categoryId !== undefined && categoryId !== null) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({
                    message: "Invalid category ID"
                });
            }

            const category = await Category.findOne({
                _id: categoryId,
                userId: req.userId,
                type: "expense"
            });

            if (!category) {
                return res.status(404).json({
                    message: "Expense category not found"
                });
            }
        }

        const existingBudget = await Budget.findOne({
            userId: req.userId,
            categoryId: categoryId || null,
            periodStart: start,
            periodEnd: end
        });

        if (existingBudget) {
            return res.status(409).json({
                message: "A budget already exists for this category and period"
            });
        }

        const budget = await Budget.create({
            userId: req.userId,
            categoryId: categoryId || null,
            amountInPaise,
            periodStart: start,
            periodEnd: end
        });

        return res.status(201).json({
            budget
        });
    } catch (error) {
        console.error("Create budget error:", error);

        return res.status(500).json({
            message: "Unable to create budget"
        });
    }
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({
            userId: req.userId
        })
            .populate("categoryId", "name type icon")
            .sort({
                periodStart: -1,
                createdAt: -1
            });

        return res.status(200).json({
            budgets
        });
    } catch (error) {
        console.error("Get budgets error:", error);

        return res.status(500).json({
            message: "Unable to retrieve budgets"
        });
    }
};

const getBudget = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid budget ID"
            });
        }

        const budget = await Budget.findOne({
            _id: id,
            userId: req.userId
        }).populate("categoryId", "name type icon");

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            budget
        });
    } catch (error) {
        console.error("Get budget error:", error);

        return res.status(500).json({
            message: "Unable to retrieve budget"
        });
    }
};

const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid budget ID"
            });
        }

        const {
            categoryId,
            amountInPaise,
            periodStart,
            periodEnd
        } = req.body;

        const budget = await Budget.findOne({
            _id: id,
            userId: req.userId
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        if (
            amountInPaise !== undefined &&
            (!Number.isInteger(amountInPaise) || amountInPaise <= 0)
        ) {
            return res.status(400).json({
                message: "Budget amount must be a positive whole number of paise"
            });
        }

        let newCategoryId = budget.categoryId;
        let newStart = budget.periodStart;
        let newEnd = budget.periodEnd;

        if (categoryId !== undefined) {
            if (categoryId !== null) {
                if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                    return res.status(400).json({
                        message: "Invalid category ID"
                    });
                }

                const category = await Category.findOne({
                    _id: categoryId,
                    userId: req.userId,
                    type: "expense"
                });

                if (!category) {
                    return res.status(404).json({
                        message: "Expense category not found"
                    });
                }
            }

            newCategoryId = categoryId;
        }

        if (periodStart !== undefined) {
            newStart = new Date(periodStart);

            if (Number.isNaN(newStart.getTime())) {
                return res.status(400).json({
                    message: "Invalid period start"
                });
            }
        }

        if (periodEnd !== undefined) {
            newEnd = new Date(periodEnd);

            if (Number.isNaN(newEnd.getTime())) {
                return res.status(400).json({
                    message: "Invalid period end"
                });
            }
        }

        if (newStart >= newEnd) {
            return res.status(400).json({
                message: "Period end must be after period start"
            });
        }

        const duplicate = await Budget.findOne({
            userId: req.userId,
            categoryId: newCategoryId || null,
            periodStart: newStart,
            periodEnd: newEnd,
            _id: { $ne: id }
        });

        if (duplicate) {
            return res.status(409).json({
                message: "A budget already exists for this category and period"
            });
        }

        if (categoryId !== undefined) {
            budget.categoryId = categoryId;
        }

        if (amountInPaise !== undefined) {
            budget.amountInPaise = amountInPaise;
        }

        if (periodStart !== undefined) {
            budget.periodStart = newStart;
        }

        if (periodEnd !== undefined) {
            budget.periodEnd = newEnd;
        }

        await budget.save();

        return res.status(200).json({
            budget
        });
    } catch (error) {
        console.error("Update budget error:", error);

        return res.status(500).json({
            message: "Unable to update budget"
        });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid budget ID"
            });
        }

        const budget = await Budget.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        return res.status(200).json({
            message: "Budget deleted successfully"
        });
    } catch (error) {
        console.error("Delete budget error:", error);

        return res.status(500).json({
            message: "Unable to delete budget"
        });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget
};