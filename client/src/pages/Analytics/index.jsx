import { useEffect, useMemo, useState } from "react"
import { api } from "../../api/api"

function Analytics() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError("")

        const [transactionData, categoryData] = await Promise.all([
          api.get("/transactions"),
          api.get("/categories"),
        ])

        setTransactions(transactionData.transactions || [])
        setCategories(categoryData.categories || [])
      } catch (err) {
        setError(err.message || "Unable to load analytics.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const analytics = useMemo(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const getMonthlyTransactions = (year, month) =>
      transactions.filter((transaction) => {
        const date = new Date(transaction.date)

        return (
          date.getFullYear() === year &&
          date.getMonth() === month
        )
      })

    const getTotal = (items, type) =>
      items
        .filter((transaction) => transaction.type === type)
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amountInPaise || 0),
          0
        )

    const currentMonthTransactions = getMonthlyTransactions(
      currentYear,
      currentMonth
    )

    const income = getTotal(currentMonthTransactions, "income")
    const expenses = getTotal(currentMonthTransactions, "expense")

    const categoryTotals = {}

    currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const categoryId =
          typeof transaction.categoryId === "object"
            ? transaction.categoryId?._id
            : transaction.categoryId

        const category = categories.find(
          (item) => item._id === categoryId
        )

        const name = category?.name || "Uncategorized"

        categoryTotals[name] =
          (categoryTotals[name] || 0) +
          Number(transaction.amountInPaise || 0)
      })

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        currentYear,
        currentMonth - 5 + index,
        1
      )

      const monthTransactions = getMonthlyTransactions(
        date.getFullYear(),
        date.getMonth()
      )

      return {
        label: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        income: getTotal(monthTransactions, "income"),
        expenses: getTotal(monthTransactions, "expense"),
      }
    })

    return {
      income,
      expenses,
      balance: income - expenses,
      categoryBreakdown,
      monthlyTrends,
    }
  }, [transactions, categories])

  function formatMoney(amountInPaise) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amountInPaise / 100)
  }

  const maxMonthlyAmount = Math.max(
    1,
    ...analytics.monthlyTrends.flatMap((month) => [
      month.income,
      month.expenses,
    ])
  )

  if (loading) {
    return (
      <section className="page">
        <p className="page-eyebrow">YOUR MONEY, IN PERSPECTIVE</p>
        <h1>Analytics</h1>
        <p className="page-description" role="status">
          Loading your financial overview...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page">
        <p className="page-eyebrow">YOUR MONEY, IN PERSPECTIVE</p>
        <h1>Analytics</h1>
        <p className="page-description" role="alert">
          {error}
        </p>
        <button
          className="analytics-retry"
          type="button"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </section>
    )
  }

  const currentMonthLabel = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })

  return (
    <section className="page analytics-page">
      <header className="analytics-heading">
        <div>
          <p className="page-eyebrow">YOUR MONEY, IN PERSPECTIVE</p>
          <h1>Analytics</h1>
          <p className="page-description">
            Small insights today. Better money decisions tomorrow.
          </p>
        </div>

        <div className="analytics-period">
          <span className="analytics-period-dot" />
          {currentMonthLabel}
        </div>
      </header>

      <section className="analytics-section">
        <div className="analytics-section-heading">
          <div>
            <p className="analytics-kicker">THE BIG PICTURE</p>
            <h2>Monthly overview</h2>
          </div>
          <span className="analytics-section-caption">
            Income and expenses
          </span>
        </div>

        <div className="analytics-summary-grid">
          <article className="analytics-summary-card income-summary">
            <div className="analytics-card-topline">
              <span className="analytics-card-icon" aria-hidden="true">
                ↙
              </span>
              <span className="analytics-card-label">Money received</span>
            </div>

            <p className="analytics-card-value">
              {formatMoney(analytics.income)}
            </p>

            <p className="analytics-card-note">
              Total income this month
            </p>
          </article>

          <article className="analytics-summary-card expense-summary">
            <div className="analytics-card-topline">
              <span className="analytics-card-icon" aria-hidden="true">
                ↗
              </span>
              <span className="analytics-card-label">Money spent</span>
            </div>

            <p className="analytics-card-value">
              {formatMoney(analytics.expenses)}
            </p>

            <p className="analytics-card-note">
              Total expenses this month
            </p>
          </article>

          <article className="analytics-summary-card balance-summary">
            <div className="analytics-card-topline">
              <span className="analytics-card-icon" aria-hidden="true">
                ₹
              </span>
              <span className="analytics-card-label">Net balance</span>
            </div>

            <p className="analytics-card-value">
              {formatMoney(analytics.balance)}
            </p>

            <p className="analytics-card-note">
              {analytics.balance >= 0
                ? "Income remaining after expenses"
                : "Spending exceeded recorded income"}
            </p>
          </article>
        </div>
      </section>

      <section className="analytics-panel">
        <div className="analytics-section-heading">
          <div>
            <p className="analytics-kicker">OVER TIME</p>
            <h2>Income vs. expenses</h2>
            <p className="page-description">
              See how money has moved over the last six months.
            </p>
          </div>
        </div>

        <div className="analytics-legend">
          <span>
            <i className="legend-dot income-dot" />
            Income
          </span>
          <span>
            <i className="legend-dot expense-dot" />
            Expenses
          </span>
        </div>

        <div className="analytics-month-list">
          {analytics.monthlyTrends.map((month) => (
            <article className="analytics-month-row" key={month.label}>
              <div className="analytics-month-heading">
                <strong>{month.label}</strong>
              </div>

              <div className="analytics-month-metrics">
                <div className="analytics-month-metric">
                  <div className="analytics-bar-label">
                    <span>Income</span>
                    <strong>{formatMoney(month.income)}</strong>
                  </div>

                  <div
                    className="analytics-bar-track"
                    role="img"
                    aria-label={`Income: ${formatMoney(month.income)}`}
                  >
                    <div
                      className="analytics-bar income-bar"
                      style={{
                        width: `${
                          (month.income / maxMonthlyAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="analytics-month-metric">
                  <div className="analytics-bar-label">
                    <span>Expenses</span>
                    <strong>{formatMoney(month.expenses)}</strong>
                  </div>

                  <div
                    className="analytics-bar-track"
                    role="img"
                    aria-label={`Expenses: ${formatMoney(month.expenses)}`}
                  >
                    <div
                      className="analytics-bar expense-bar"
                      style={{
                        width: `${
                          (month.expenses / maxMonthlyAmount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="analytics-chart-footnote">
          Both bars use the same scale, making monthly amounts easier to
          compare.
        </p>
      </section>

      <section className="analytics-panel">
        <div className="analytics-section-heading">
          <div>
            <p className="analytics-kicker">KNOW YOUR HABITS</p>
            <h2>Where your money goes</h2>
            <p className="page-description">
              A category-wise look at this month's expenses.
            </p>
          </div>

          <span className="analytics-category-count">
            {analytics.categoryBreakdown.length}{" "}
            {analytics.categoryBreakdown.length === 1
              ? "category"
              : "categories"}
          </span>
        </div>

        {analytics.categoryBreakdown.length === 0 ? (
          <div className="analytics-empty-state">
            <span aria-hidden="true">◎</span>
            <h3>Your spending story starts here</h3>
            <p>
              Add an expense this month to see how your spending is
              distributed across categories.
            </p>
          </div>
        ) : (
          <>
            <div className="analytics-category-total">
              <span>Total categorized and uncategorized spending</span>
              <strong>{formatMoney(analytics.expenses)}</strong>
            </div>

            <div className="analytics-category-list">
              {analytics.categoryBreakdown.map((item, index) => (
                <article className="analytics-category-row" key={item.name}>
                  <div className="analytics-category-heading">
                    <div className="analytics-category-name">
                      <span
                        className={`analytics-category-marker marker-${index % 5}`}
                        aria-hidden="true"
                      />
                      <strong>{item.name}</strong>
                    </div>

                    <div className="analytics-category-amount">
                      <strong>{formatMoney(item.amount)}</strong>
                      <span>{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div
                    className="analytics-category-track"
                    role="img"
                    aria-label={`${item.name}: ${item.percentage.toFixed(
                      1
                    )}% of monthly expenses`}
                  >
                    <div
                      className={`analytics-category-fill marker-fill-${index % 5}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  )
}

export default Analytics