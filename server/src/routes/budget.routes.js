const express = require("express");

const {
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget
} = require("../controllers/budget.controller");

const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;