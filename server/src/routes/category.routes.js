const express = require("express");

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/category.controller");

const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;