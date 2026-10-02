const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },

        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },

        amountInPaise: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Amount must be a whole number of paise"
            }
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        paymentMethod: {
            type: String,
            enum: [
                "UPI",
                "Cash",
                "Debit Card",
                "Credit Card",
                "Bank Transfer",
                "Other"
            ],
            required: true
        },

        note: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
