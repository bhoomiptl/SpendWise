const Transaction = require("../models/Transaction");

const getInsights = async (req, res) => {
    try {
        const now = new Date();

        // Current month's date range
        const currentMonthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const nextMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        // Previous month's date range
        const previousMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        // Fetch current month's transactions
        const currentTransactions = await Transaction.find({
            userId: req.userId,
            date: {
                $gte: currentMonthStart,
                $lt: nextMonthStart
            }
        }).populate("categoryId", "name");

        // Fetch previous month's transactions
        const previousTransactions = await Transaction.find({
            userId: req.userId,
            date: {
                $gte: previousMonthStart,
                $lt: currentMonthStart
            }
        });

        // Calculate totals
        const calculateTotals = (transactions) => {
            let income = 0;
            let expenses = 0;

            transactions.forEach((transaction) => {
                if (transaction.type === "income") {
                    income += transaction.amountInPaise;
                } else if (transaction.type === "expense") {
                    expenses += transaction.amountInPaise;
                }
            });

            return {
                incomeInPaise: income,
                expensesInPaise: expenses,
                savingsInPaise: income - expenses
            };
        };

        const currentMonth = calculateTotals(currentTransactions);
        const previousMonth = calculateTotals(previousTransactions);

        // Calculate spending by category
        const categorySpending = {};

        currentTransactions.forEach((transaction) => {
            if (transaction.type !== "expense") {
                return;
            }

            const categoryId = transaction.categoryId?._id?.toString()
                || "uncategorized";

            const categoryName = transaction.categoryId?.name
                || "Uncategorized";

            if (!categorySpending[categoryId]) {
                categorySpending[categoryId] = {
                    categoryId:
                        categoryId === "uncategorized" ? null : categoryId,
                    categoryName,
                    amountInPaise: 0
                };
            }

            categorySpending[categoryId].amountInPaise +=
                transaction.amountInPaise;
        });

        const topExpenseCategory = Object.values(categorySpending)
            .sort((a, b) => b.amountInPaise - a.amountInPaise)[0] || null;

        // Compare this month's expenses with last month's expenses
        let expenseChangePercent = null;

        if (previousMonth.expensesInPaise > 0) {
            expenseChangePercent =
                (
                    (currentMonth.expensesInPaise -
                        previousMonth.expensesInPaise) /
                    previousMonth.expensesInPaise
                ) * 100;
        } else if (currentMonth.expensesInPaise > 0) {
            expenseChangePercent = 100;
        } else {
            expenseChangePercent = 0;
        }

        // Generate simple financial observations
        const observations = [];

        if (currentTransactions.length === 0) {
            observations.push({
                type: "info",
                message:
                    "You have no transactions recorded for this month yet. Add transactions to start receiving insights."
            });
        } else {
            if (currentMonth.savingsInPaise > 0) {
                observations.push({
                    type: "positive",
                    message:
                        "Your recorded income is higher than your expenses this month. Keep tracking your spending."
                });
            } else if (currentMonth.savingsInPaise < 0) {
                observations.push({
                    type: "warning",
                    message:
                        "Your recorded expenses are higher than your income this month. Review your spending if possible."
                });
            } else {
                observations.push({
                    type: "info",
                    message:
                        "Your recorded income and expenses are equal this month."
                });
            }

            if (topExpenseCategory) {
                observations.push({
                    type: "info",
                    message:
                        `${topExpenseCategory.categoryName} is your highest-spending category this month.`
                });
            }

            if (expenseChangePercent > 0) {
                observations.push({
                    type: "warning",
                    message:
                        `Your expenses are ${expenseChangePercent.toFixed(1)}% higher than last month.`
                });
            } else if (expenseChangePercent < 0) {
                observations.push({
                    type: "positive",
                    message:
                        `Your expenses are ${Math.abs(expenseChangePercent).toFixed(1)}% lower than last month.`
                });
            } else {
                observations.push({
                    type: "info",
                    message:
                        "Your expenses have not changed compared with last month, based on the recorded totals."
                });
            }
        }

        return res.status(200).json({
            currentMonth,
            previousMonth,
            expenseChangePercent,
            topExpenseCategory,
            observations
        });
    } catch (error) {
        console.error("Get insights error:", error);

        return res.status(500).json({
            message: "Unable to generate financial insights"
        });
    }
};

module.exports = {
    getInsights
};