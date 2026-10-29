import { useEffect, useState } from "react"
import { api } from "../../api/api"

function Insights() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true)
        setError("")

        const data = await api.get("/insights")
        setInsights(data)
      } catch (err) {
        setError(err.message || "Unable to load insights.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  function formatCurrency(amountInPaise = 0) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format((Number(amountInPaise) || 0) / 100)
  }

  function formatPercentage(percentage) {
    if (percentage === null || percentage === undefined) {
      return "Not available"
    }

    return `${Math.abs(percentage).toFixed(1)}%`
  }

  if (loading) {
    return (
      <section className="page insights-page">
        <p className="page-eyebrow">YOUR FINANCIAL WELLBEING</p>
        <h1>Insights</h1>
        <p className="page-description" role="status">
          Looking for patterns in your financial activity...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page insights-page">
        <p className="page-eyebrow">YOUR FINANCIAL WELLBEING</p>
        <h1>Insights</h1>
        <p className="page-description">
          Understand your money habits and make more informed decisions.
        </p>

        <div className="insights-empty-state" role="alert">
          <h2>We couldn't load your insights.</h2>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (!insights) {
    return (
      <section className="page insights-page">
        <p className="page-eyebrow">YOUR FINANCIAL WELLBEING</p>
        <h1>Insights</h1>
        <p>No insights are available yet.</p>
      </section>
    )
  }

  const {
    currentMonth = {},
    previousMonth = {},
    expenseChangePercent,
    topExpenseCategory,
    observations = [],
  } = insights

  const currentExpenses = Number(currentMonth.expensesInPaise) || 0
  const previousExpenses = Number(previousMonth.expensesInPaise) || 0

  const hasComparison =
    expenseChangePercent !== null &&
    expenseChangePercent !== undefined &&
    Number.isFinite(Number(expenseChangePercent))

  const change = hasComparison ? Number(expenseChangePercent) : null

  const comparisonMaximum = Math.max(
    currentExpenses,
    previousExpenses,
    1
  )

  const changeLabel =
    change === null
      ? "Not available"
      : `${change > 0 ? "+" : change < 0 ? "−" : ""}${formatPercentage(change)}`

  const changeDescription =
    change === null
      ? "Not enough data to calculate the change."
      : change > 0
        ? "Your recorded expenses have increased."
        : change < 0
          ? "Your recorded expenses have decreased."
          : "Your recorded expenses are unchanged."

  const changeClass =
    change === null
      ? "change-neutral"
      : change > 0
        ? "change-increase"
        : change < 0
          ? "change-decrease"
          : "change-neutral"

  const currentMonthLabel = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })

  return (
    <section className="page insights-page">
      <header className="insights-heading">
        <div>
          <p className="page-eyebrow">YOUR FINANCIAL WELLBEING</p>
          <h1>Insights</h1>
          <p className="page-description">
            Understand your money habits. Make every rupee more meaningful.
          </p>
        </div>

        <div className="insights-period">
          <span className="analytics-period-dot" />
          {currentMonthLabel}
        </div>
      </header>

      <section className="insights-section">
        <div className="insights-section-heading">
          <div>
            <p className="analytics-kicker">YOUR MONEY AT A GLANCE</p>
            <h2>This month's picture</h2>
          </div>
        </div>

        <div className="insights-grid">
          <article className="insight-card insight-summary income-insight">
            <div className="insight-summary-top">
              <span className="insight-summary-icon" aria-hidden="true">
                ↙
              </span>
              <span className="insight-label">Money received</span>
            </div>
            <h2>{formatCurrency(currentMonth.incomeInPaise)}</h2>
            <p className="insight-note">Recorded income this month</p>
          </article>

          <article className="insight-card insight-summary expense-insight">
            <div className="insight-summary-top">
              <span className="insight-summary-icon" aria-hidden="true">
                ↗
              </span>
              <span className="insight-label">Money spent</span>
            </div>
            <h2>{formatCurrency(currentMonth.expensesInPaise)}</h2>
            <p className="insight-note">Recorded expenses this month</p>
          </article>

          <article className="insight-card insight-summary savings-insight">
            <div className="insight-summary-top">
              <span className="insight-summary-icon" aria-hidden="true">
                ₹
              </span>
              <span className="insight-label">Net balance</span>
            </div>
            <h2>{formatCurrency(currentMonth.savingsInPaise)}</h2>
            <p className="insight-note">
              Income minus expenses this month
            </p>
          </article>

          <article className="insight-card insight-summary category-insight">
            <div className="insight-summary-top">
              <span className="insight-summary-icon" aria-hidden="true">
                ◎
              </span>
              <span className="insight-label">Top spending category</span>
            </div>
            <h2 className="insight-category">
              {topExpenseCategory?.categoryName || "No expenses yet"}
            </h2>
            <p className="insight-note">
              {topExpenseCategory
                ? formatCurrency(topExpenseCategory.amountInPaise)
                : "Record an expense to discover your top category."}
            </p>
          </article>
        </div>
      </section>

      <section className="insights-panel">
        <div className="insights-section-heading">
          <div>
            <p className="analytics-kicker">THE BIGGER PICTURE</p>
            <h2>Month-to-month comparison</h2>
            <p className="page-description">
              See how your recorded expenses have changed.
            </p>
          </div>
        </div>

        <div className="insights-comparison">
          <div className="comparison-summary">
            <span className="comparison-summary-label">
              Change in expenses
            </span>

            <strong className={`comparison-change ${changeClass}`}>
              {changeLabel}
            </strong>

            <p>{changeDescription}</p>
          </div>

          <div className="comparison-bars">
            <div className="comparison-bar-item">
              <div className="comparison-row">
                <span>Current month</span>
                <strong>{formatCurrency(currentExpenses)}</strong>
              </div>

              <div
                className="comparison-track"
                role="img"
                aria-label={`Current month expenses: ${formatCurrency(
                  currentExpenses
                )}`}
              >
                <div
                  className="comparison-fill current-comparison-fill"
                  style={{
                    width: `${(currentExpenses / comparisonMaximum) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="comparison-bar-item">
              <div className="comparison-row">
                <span>Previous month</span>
                <strong>{formatCurrency(previousExpenses)}</strong>
              </div>

              <div
                className="comparison-track"
                role="img"
                aria-label={`Previous month expenses: ${formatCurrency(
                  previousExpenses
                )}`}
              >
                <div
                  className="comparison-fill previous-comparison-fill"
                  style={{
                    width: `${(previousExpenses / comparisonMaximum) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="insights-footnote">
          This comparison uses transactions recorded in each calendar
          month. The current month may be incomplete, so compare cautiously.
        </p>
      </section>

      <section className="insights-section">
        <div className="insights-section-heading">
          <div>
            <p className="analytics-kicker">SMALL PATTERNS, USEFUL CLUES</p>
            <h2>What your activity tells you</h2>
            <p className="page-description">
              Observations based on your recorded financial activity.
            </p>
          </div>

          <span className="insights-count">
            {observations.length}{" "}
            {observations.length === 1 ? "observation" : "observations"}
          </span>
        </div>

        {observations.length > 0 ? (
          <div className="observations-list">
            {observations.map((observation, index) => {
              const type = [
                "positive",
                "warning",
                "insight",
              ].includes(observation.type)
                ? observation.type
                : "insight"

              const label =
                type === "positive"
                  ? "Positive"
                  : type === "warning"
                    ? "Attention"
                    : "Insight"

              return (
                <article
                  className={`insight-card observation-card observation-${type}`}
                  key={`${observation.type}-${index}`}
                >
                  <span
                    className={`observation-badge ${type}`}
                  >
                    {label}
                  </span>

                  <p>{observation.message}</p>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="insights-empty-state">
            <span aria-hidden="true">◎</span>
            <h3>Your insights will grow with your data</h3>
            <p>
              Keep recording income and expenses to uncover useful patterns
              in your financial activity.
            </p>
          </div>
        )}
      </section>
    </section>
  )
}

export default Insights