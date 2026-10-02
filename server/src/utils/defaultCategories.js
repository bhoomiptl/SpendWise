const Category = require("../models/Category");

const defaultExpenseCategories = [
    "Food",
    "Transport",
    "Stationery",
    "Entertainment",
    "Courses & Skills",
    "Books",
    "Health",
    "Shopping",
    "Rent",
    "Other"
];

const defaultIncomeCategories = [
    "Parents / Family",
    "Scholarship",
    "Internship",
    "Part-time",
    "Freelance",
    "Gift",
    "Refund",
    "Other"
];

const createDefaultCategories = async (userId) => {
    const categories = [
        ...defaultExpenseCategories.map((name) => ({
            userId,
            name,
            type: "expense",
            icon: "default",
            isDefault: true
        })),

        ...defaultIncomeCategories.map((name) => ({
            userId,
            name,
            type: "income",
            icon: "default",
            isDefault: true
        }))
    ];

    await Category.insertMany(categories, {
        ordered: false
    });
};

module.exports = {
    createDefaultCategories
};