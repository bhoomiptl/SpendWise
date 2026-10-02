const mongoose = require("mongoose");

const Category = require("../models/Category");

const createCategory = async (req, res) => {
    try {
        const { name, type, icon } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Name and type are required"
            });
        }

        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Type must be income or expense"
            });
        }

        const normalizedName = name.trim();

        if (normalizedName.length < 2) {
            return res.status(400).json({
                message: "Category name must be at least 2 characters"
            });
        }

        const existingCategory = await Category.findOne({
            userId: req.userId,
            name: normalizedName,
            type
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "A category with this name already exists"
            });
        }

        const category = await Category.create({
            userId: req.userId,
            name: normalizedName,
            type,
            icon: icon || "default",
            isDefault: false
        });

        return res.status(201).json({
            category
        });
    } catch (error) {
        console.error("Create category error:", error);

        return res.status(500).json({
            message: "Unable to create category"
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            userId: req.userId
        }).sort({
            type: 1,
            name: 1
        });

        return res.status(200).json({
            categories
        });
    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            message: "Unable to retrieve categories"
        });
    }
};

const getCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const category = await Category.findOne({
            _id: id,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            category
        });
    } catch (error) {
        console.error("Get category error:", error);

        return res.status(500).json({
            message: "Unable to retrieve category"
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const category = await Category.findOne({
            _id: id,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (category.isDefault) {
            return res.status(400).json({
                message: "Default categories cannot be modified"
            });
        }

        if (name !== undefined) {
            const normalizedName = name.trim();

            if (normalizedName.length < 2) {
                return res.status(400).json({
                    message: "Category name must be at least 2 characters"
                });
            }

            const duplicate = await Category.findOne({
                userId: req.userId,
                name: normalizedName,
                type: category.type,
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(409).json({
                    message: "A category with this name already exists"
                });
            }

            category.name = normalizedName;
        }

        if (icon !== undefined) {
            category.icon = icon;
        }

        await category.save();

        return res.status(200).json({
            category
        });
    } catch (error) {
        console.error("Update category error:", error);

        return res.status(500).json({
            message: "Unable to update category"
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid category ID"
            });
        }

        const category = await Category.findOne({
            _id: id,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        if (category.isDefault) {
            return res.status(400).json({
                message: "Default categories cannot be deleted"
            });
        }

        await category.deleteOne();

        return res.status(200).json({
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Delete category error:", error);

        return res.status(500).json({
            message: "Unable to delete category"
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};