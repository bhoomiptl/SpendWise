import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("₹", "₹");

const getTransactionDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

function Dashboard() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [transactionResponse, categoryResponse] = await Promise.all([
          api.get("/transactions"),
          api.get("/categories"),
        ]);

        if (cancelled) return;

        setTransactions(transactionResponse.transactions || []);
        setCategories(categoryResponse.categories || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load dashboard data. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryMap = Object.fromEntries(
    categories.map((category) => [String(category._id), category.name])
  );

  const now = new Date();

  const thisMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date);

    return (
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const income = thisMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + transaction.amountInPaise / 100,
      0
    );

  const expenses = thisMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + transaction.amountInPaise / 100,
      0
    );

  const balance = income - expenses;

  const categoryTotals = {};

  thisMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const categoryName = transaction.categoryId
        ? categoryMap[String(transaction.categoryId)]
        : null;

      const name = categoryName || "Uncategorized";
      const amount = transaction.amountInPaise / 100;

      categoryTotals[name] = (categoryTotals[name] || 0) + amount;
    });

  const spendingCategories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((transaction) => {
      const categoryName = transaction.categoryId
        ? categoryMap[String(transaction.categoryId)]
        : null;

      const isIncome = transaction.type === "income";

      return {
        id: transaction._id,
        name:
          transaction.note?.trim() ||
          categoryName ||
          (isIncome ? "Income" : "Expense"),
        category: categoryName || "Uncategorized",
        date: getTransactionDate(transaction.date),
        amount: transaction.amountInPaise / 100,
        isIncome,
      };
    });

  const summaryCards = [
    {
      label: "Balance",
      value: formatCurrency(balance),
      helper: "Income minus expenses this month",
    },
    {
      label: "Income",
      value: formatCurrency(income),
      helper: "Money received this month",
    },
    {
      label: "Expenses",
      value: formatCurrency(expenses),
      helper: "Money spent this month",
    },
  ];

  return (
    <section className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Here's a clear view of how your money is moving this month.
          </p>
        </div>

        <button
          className="button button-primary"
          type="button"
          onClick={() => navigate("/transactions")}
        >
          + Add transaction
        </button>
      </div>

      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p role="status">Loading your dashboard...</p>
      ) : (
        <>
          <div className="summary-grid">
            {summaryCards.map((card) => (
              <div className="summary-card" key={card.label}>
                <p>{card.label}</p>
                <h2>{card.value}</h2>
                <span>{card.helper}</span>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-card spending-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">This month</p>
                  <h2>Spending overview</h2>
                </div>

                <span className="card-total">
                  {formatCurrency(expenses)}
                </span>
              </div>

              <div className="category-list">
                {spendingCategories.length > 0 ? (
                  spendingCategories.map((category) => (
                    <div className="category-item" key={category.name}>
                      <div className="category-info">
                        <span>{category.name}</span>
                        <strong>{formatCurrency(category.amount)}</strong>
                      </div>

                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label={`${category.name} spending`}
                        aria-valuenow={Math.round(category.percentage)}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{
                            width: `${category.percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No expenses recorded this month yet.</p>
                )}
              </div>
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">Your activity</p>
                  <h2>Recent transactions</h2>
                </div>
              </div>

              <div className="transaction-list">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div
                      className="transaction-item"
                      key={transaction.id}
                    >
                      <div>
                        <strong>{transaction.name}</strong>
                        <span>
                          {transaction.category} · {transaction.date}
                        </span>
                      </div>

                      <strong
                        className={
                          transaction.isIncome
                            ? "amount-positive"
                            : "amount-negative"
                        }
                      >
                        {transaction.isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </strong>
                    </div>
                  ))
                ) : (
                  <p>No transactions yet. Add your first transaction!</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;