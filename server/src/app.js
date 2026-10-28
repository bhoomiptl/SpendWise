
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const categoryRoutes = require("./routes/category.routes");
const budgetRoutes = require("./routes/budget.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const insightRoutes = require("./routes/insight.routes");
const goalRoutes = require("./routes/goal.routes");
const WhatIfRoutes = require("./routes/WhatIf.routes");
const recurringRoutes = require("./routes/recurring.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/whatif", WhatIfRoutes);
app.use("/api/recurring-transactions", recurringRoutes);
app.use("/api/health", healthRoutes);

module.exports = app;
