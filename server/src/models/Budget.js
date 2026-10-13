const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // null means this is an overall budget
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },

        amountInPaise: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Budget amount must be a whole number of paise"
            }
        },

        periodStart: {
            type: Date,
            required: true
        },

        periodEnd: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

budgetSchema.index({
    userId: 1,
    categoryId: 1,
    periodStart: 1,
    periodEnd: 1
});

module.exports = mongoose.model("Budget", budgetSchema);