const express = require("express");

const {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
} = require("../controllers/transaction.controller");

const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;