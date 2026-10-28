const express = require("express");

const {
    calculateWhatIf
} = require("../controllers/WhatIf.controller");

const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

// Require login before running a What-If calculation
router.use(requireAuth);

// Calculate a What-If scenario
router.post("/", calculateWhatIf);

module.exports = router;