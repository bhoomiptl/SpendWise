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

    const currentMonthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date)

      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      )
    })

    const income = currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amountInPaise || 0),
        0
      )

    const expenses = currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amountInPaise || 0),
        0
      )

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
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)

    const monthlyTrends = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(currentYear, currentMonth - 5 + index, 1)
      const year = date.getFullYear()
      const month = date.getMonth()

      const monthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)

        return (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() === month
        )
      })

      const monthIncome = monthTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amountInPaise || 0),
          0
        )

      const monthExpenses = monthTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amountInPaise || 0),
          0
        )

      return {
        label: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        income: monthIncome,
        expenses: monthExpenses,
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

  const maxCategoryAmount = Math.max(
    1,
    ...analytics.categoryBreakdown.map((item) => item.amount)
  )

  if (loading) {
    return (
      <section className="page">
        <p className="page-eyebrow">Patterns</p>
        <h1>Analytics</h1>
        <p>Loading your analytics...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page">
        <p className="page-eyebrow">Patterns</p>
        <h1>Analytics</h1>
        <p role="alert">{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </section>
    )
  }

  return (
    <section className="page">
      <p className="page-eyebrow">Patterns</p>

      <h1>Analytics</h1>

      <p className="page-description">
        Understand your spending patterns over time.
      </p>

      <h2>
        Overview —{" "}
        {new Date().toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          margin: "24px 0",
        }}
      >
        <article className="analytics-card">
          <p>Total income</p>
          <h2>{formatMoney(analytics.income)}</h2>
        </article>

        <article className="analytics-card">
          <p>Total expenses</p>
          <h2>{formatMoney(analytics.expenses)}</h2>
        </article>

        <article className="analytics-card">
          <p>Net balance</p>
          <h2>{formatMoney(analytics.balance)}</h2>
          <p>Income minus expenses</p>
        </article>
      </div>

      <section style={{ marginTop: "32px" }}>
        <h2>Monthly income vs. expenses</h2>

        <p className="page-description">
          Compare your income and spending over the last six months.
        </p>

        <div
          style={{
            display: "grid",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {analytics.monthlyTrends.map((month) => (
            <div key={month.label}>
              <strong>{month.label}</strong>

              <div style={{ marginTop: "8px" }}>
                <p style={{ margin: "4px 0" }}>
                  Income: {formatMoney(month.income)}
                </p>

                <div
                  style={{
                    height: "10px",
                    background: "#e5e7eb",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(month.income / maxMonthlyAmount) * 100}%`,
                      height: "100%",
                      background: "#16a34a",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <p style={{ margin: "4px 0" }}>
                  Expenses: {formatMoney(month.expenses)}
                </p>

                <div
                  style={{
                    height: "10px",
                    background: "#e5e7eb",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(month.expenses / maxMonthlyAmount) * 100}%`,
                      height: "100%",
                      background: "#dc2626",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "16px" }}>
          <span style={{ color: "#16a34a" }}>■</span> Income{" "}
          &nbsp;&nbsp;
          <span style={{ color: "#dc2626" }}>■</span> Expenses
        </p>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>Expense breakdown by category</h2>

        <p className="page-description">
          See which categories account for your spending this month.
        </p>

        {analytics.categoryBreakdown.length === 0 ? (
          <p>No expense transactions recorded this month yet.</p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {analytics.categoryBreakdown.map((item) => (
              <div key={item.name} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{item.name}</strong>
                  <span>{formatMoney(item.amount)}</span>
                </div>

                <div
                  style={{
                    height: "12px",
                    background: "#e5e7eb",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.amount / maxCategoryAmount) * 100}%`,
                      height: "100%",
                      background: "#6366f1",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export default Analytics