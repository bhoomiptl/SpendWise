const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
    try {
        const {
            categoryId,
            type,
            amountInPaise,
            date,
            paymentMethod,
            note
        } = req.body;

        if (!type || amountInPaise === undefined || !paymentMethod) {
            return res.status(400).json({
                message: "Type, amount and payment method are required"
            });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Type must be income or expense"
            });
        }

        if (
            !Number.isInteger(amountInPaise) ||
            amountInPaise <= 0
        ) {
            return res.status(400).json({
                message: "Amount must be a positive whole number of paise"
            });
        }

        if (
            categoryId &&
            !mongoose.Types.ObjectId.isValid(categoryId)
        ) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const transaction = await Transaction.create({
            userId: req.userId,
            categoryId: categoryId || null,
            type,
            amountInPaise,
            date: date ? new Date(date) : new Date(),
            paymentMethod,
            note: note || ""
        });

        return res.status(201).json({
            transaction
        });
    } catch (error) {
        console.error("Create transaction error:", error);

        return res.status(500).json({
            message: "Unable to create transaction"
        });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.userId
        }).sort({
            date: -1,
            createdAt: -1
        });

        return res.status(200).json({
            transactions
        });
    } catch (error) {
        console.error("Get transactions error:", error);

        return res.status(500).json({
            message: "Unable to retrieve transactions"
        });
    }
};

const getTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const transaction = await Transaction.findOne({
            _id: id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            transaction
        });
    } catch (error) {
        console.error("Get transaction error:", error);

        return res.status(500).json({
            message: "Unable to retrieve transaction"
        });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const {
            categoryId,
            type,
            amountInPaise,
            date,
            paymentMethod,
            note
        } = req.body;

        if (type !== undefined && !["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Type must be income or expense"
            });
        }

        if (
            amountInPaise !== undefined &&
            (!Number.isInteger(amountInPaise) || amountInPaise <= 0)
        ) {
            return res.status(400).json({
                message: "Amount must be a positive whole number of paise"
            });
        }

        if (
            categoryId &&
            !mongoose.Types.ObjectId.isValid(categoryId)
        ) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const updates = {};

        if (categoryId !== undefined) {
            updates.categoryId = categoryId || null;
        }

        if (type !== undefined) {
            updates.type = type;
        }

        if (amountInPaise !== undefined) {
            updates.amountInPaise = amountInPaise;
        }

        if (date !== undefined) {
            updates.date = new Date(date);
        }

        if (paymentMethod !== undefined) {
            updates.paymentMethod = paymentMethod;
        }

        if (note !== undefined) {
            updates.note = note;
        }

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            transaction
        });
    } catch (error) {
        console.error("Update transaction error:", error);

        return res.status(500).json({
            message: "Unable to update transaction"
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        console.error("Delete transaction error:", error);

        return res.status(500).json({
            message: "Unable to delete transaction"
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
};