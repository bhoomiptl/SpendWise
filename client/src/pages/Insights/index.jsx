import { useEffect, useState } from "react";
import { api } from "../../api/api";

function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.get("/insights");
        setInsights(data);
      } catch (err) {
        setError(err.message || "Unable to load insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const formatCurrency = (amountInPaise = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amountInPaise / 100);
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined) {
      return "Not available";
    }

    return `${Math.abs(percentage).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <section className="page">
        <p className="page-eyebrow">Awareness</p>
        <h1>Insights</h1>
        <p className="page-description">
          Analyzing your financial activity...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <p className="page-eyebrow">Awareness</p>
        <h1>Insights</h1>
        <p className="page-description">
          Notice meaningful patterns in your financial activity.
        </p>

        <div className="insight-card">
          <p>We couldn't load your insights.</p>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!insights) {
    return null;
  }

  const {
    currentMonth,
    previousMonth,
    expenseChangePercent,
    topExpenseCategory,
    observations = [],
  } = insights;

  return (
    <section className="page">
      <p className="page-eyebrow">Awareness</p>

      <h1>Insights</h1>

      <p className="page-description">
        Understand your income, expenses, and spending patterns.
      </p>

      <div className="insights-grid">
        <article className="insight-card">
          <p className="insight-label">Income this month</p>
          <h2>{formatCurrency(currentMonth.incomeInPaise)}</h2>
          <p className="insight-note">Recorded income</p>
        </article>

        <article className="insight-card">
          <p className="insight-label">Expenses this month</p>
          <h2>{formatCurrency(currentMonth.expensesInPaise)}</h2>
          <p className="insight-note">Recorded expenses</p>
        </article>

        <article className="insight-card">
          <p className="insight-label">Savings balance</p>
          <h2>{formatCurrency(currentMonth.savingsInPaise)}</h2>
          <p className="insight-note">
            Income minus expenses this month
          </p>
        </article>

        <article className="insight-card">
          <p className="insight-label">Top spending category</p>
          <h2 className="insight-category">
            {topExpenseCategory?.categoryName || "No expenses yet"}
          </h2>
          <p className="insight-note">
            {topExpenseCategory
              ? formatCurrency(topExpenseCategory.amountInPaise)
              : "Add an expense to discover your top category."}
          </p>
        </article>
      </div>

      <div className="insight-section">
        <h2>Month-to-month comparison</h2>

        <div className="insight-card">
          <div className="comparison-row">
            <span>Current month expenses</span>
            <strong>
              {formatCurrency(currentMonth.expensesInPaise)}
            </strong>
          </div>

          <div className="comparison-row">
            <span>Previous month expenses</span>
            <strong>
              {formatCurrency(previousMonth.expensesInPaise)}
            </strong>
          </div>

          <div className="comparison-row">
            <span>Change in expenses</span>
            <strong>
              {expenseChangePercent > 0
                ? `+${formatPercentage(expenseChangePercent)}`
                : expenseChangePercent < 0
                  ? `-${formatPercentage(expenseChangePercent)}`
                  : formatPercentage(expenseChangePercent)}
            </strong>
          </div>

          <p className="insight-note">
            This comparison uses transactions recorded in each calendar
            month. The current month may be incomplete.
          </p>
        </div>
      </div>

      <div className="insight-section">
        <h2>What your activity tells you</h2>

        <div className="observations-list">
          {observations.length > 0 ? (
            observations.map((observation, index) => (
              <article
                className="insight-card observation-card"
                key={`${observation.type}-${index}`}
              >
                <span className={`observation-badge ${observation.type}`}>
                  {observation.type === "positive"
                    ? "Positive"
                    : observation.type === "warning"
                      ? "Attention"
                      : "Insight"}
                </span>

                <p>{observation.message}</p>
              </article>
            ))
          ) : (
            <div className="insight-card">
              <p>No observations are available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Insights;