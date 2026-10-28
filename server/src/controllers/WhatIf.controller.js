const Transaction = require("../models/Transaction");

// Calculate the financial impact of reducing monthly expenses
const calculateWhatIf = async (req, res) => {
try {
const { monthlyReduction, durationMonths } = req.body;

    // Validate the monthly reduction
    if (
        !Number.isSafeInteger(monthlyReduction) ||
        monthlyReduction <= 0
    ) {
        return res.status(400).json({
            message: "Monthly reduction must be a positive whole number of paise"
        });
    }

    // Validate the simulation duration
    if (
        !Number.isInteger(durationMonths) ||
        durationMonths < 1 ||
        durationMonths > 60
    ) {
        return res.status(400).json({
            message: "Duration must be between 1 and 60 months"
        });
    }

    // Find the current month's expenses for the logged-in user
    const now = new Date();

    const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const nextMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
    );

    const transactions = await Transaction.find({
        userId: req.userId,
        type: "expense",
        date: {
            $gte: monthStart,
            $lt: nextMonthStart
        }
    });

    const currentMonthlyExpenses = transactions.reduce(
        (total, transaction) => total + transaction.amountInPaise,
        0
    );

    // Do not allow the hypothetical reduction to exceed expenses
    if (monthlyReduction > currentMonthlyExpenses) {
        return res.status(400).json({
            message: "Monthly reduction cannot exceed your current monthly expenses"
        });
    }

    const projectedMonthlyExpenses =
        currentMonthlyExpenses - monthlyReduction;

    const totalSavings =
        monthlyReduction * durationMonths;

    return res.status(200).json({
        message: "What-If calculation completed successfully",
        simulation: {
            currentMonthlyExpenses,
            monthlyReduction,
            projectedMonthlyExpenses,
            durationMonths,
            totalSavings,
            annualSavings: monthlyReduction * 12
        }
    });
} catch (error) {
    console.error("What-If calculation error:", error);

    return res.status(500).json({
        message: "Unable to calculate the What-If scenario"
    });
}

};

module.exports = {
calculateWhatIf
};
