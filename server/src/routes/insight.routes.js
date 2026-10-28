const express = require("express");

const { getInsights } = require("../controllers/insight.controller");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getInsights);

module.exports = router;