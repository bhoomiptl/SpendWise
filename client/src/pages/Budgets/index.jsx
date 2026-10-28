import { useEffect, useMemo, useState } from "react"
import { api } from "../../api/api"

function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    periodStart: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toLocaleDateString("en-CA"),
    periodEnd: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    ).toLocaleDateString("en-CA"),
  })

  async function loadData() {
    setLoading(true)
    setError("")

    try {
      const [budgetData, categoryData, transactionData] =
        await Promise.all([
          api.get("/budgets"),
          api.get("/categories"),
          api.get("/transactions"),
        ])

      setBudgets(budgetData.budgets || [])
      setCategories(categoryData.categories || [])
      setTransactions(transactionData.transactions || [])
    } catch (err) {
      setError(err.message || "Unable to load budgets.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === "expense"),
    [categories]
  )

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const amount = Number(form.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid budget amount greater than zero.")
      return
    }

    if (
      !form.periodStart ||
      !form.periodEnd ||
      form.periodStart >= form.periodEnd
    ) {
      setError("The end date must be after the start date.")
      return
    }

    setSaving(true)

    try {
      await api.post("/budgets", {
        categoryId: form.categoryId || null,
        amountInPaise: Math.round(amount * 100),
        periodStart: new Date(
          `${form.periodStart}T00:00:00.000Z`
        ).toISOString(),
        periodEnd: new Date(
          `${form.periodEnd}T00:00:00.000Z`
        ).toISOString(),
      })

      setSuccess("Budget created successfully.")

      setForm((previous) => ({
        ...previous,
        categoryId: "",
        amount: "",
      }))

      await loadData()
    } catch (err) {
      setError(err.message || "Unable to create budget.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    )

    if (!confirmed) return

    setError("")
    setSuccess("")

    try {
      await api.delete(`/budgets/${id}`)
      setBudgets((previous) =>
        previous.filter((budget) => budget._id !== id)
      )
      setSuccess("Budget deleted successfully.")
    } catch (err) {
      setError(err.message || "Unable to delete budget.")
    }
  }

  function getSpent(budget) {
    const start = new Date(budget.periodStart)
    const end = new Date(budget.periodEnd)

    return transactions
      .filter((transaction) => {
        const date = new Date(transaction.date)

        if (
          transaction.type !== "expense" ||
          date < start ||
          date >= end
        ) {
          return false
        }

        if (budget.categoryId) {
          const categoryId =
            typeof budget.categoryId === "object"
              ? budget.categoryId._id
              : budget.categoryId

          return transaction.categoryId === categoryId
        }

        return true
      })
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amountInPaise || 0),
        0
      )
  }

  function formatMoney(amountInPaise) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amountInPaise / 100)
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  return (
    <section className="page">
      <p className="page-eyebrow">Planning</p>

      <h1>Budgets</h1>

      <p className="page-description">
        Set spending limits and understand your monthly plan.
      </p>

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {success && (
        <p role="status" style={{ color: "#15803d" }}>
          {success}
        </p>
      )}

      <section className="budget-form-section">
        <h2>Create a budget</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="budget-category">Budget type</label>

            <select
              id="budget-category"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Overall expenses</option>

              {expenseCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-amount">
              Budget amount (₹)
            </label>

            <input
              id="budget-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 3000"
              required
            />
          </div>

          <div>
            <label htmlFor="budget-start">Start date</label>

            <input
              id="budget-start"
              name="periodStart"
              type="date"
              value={form.periodStart}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="budget-end">End date</label>

            <input
              id="budget-end"
              name="periodEnd"
              type="date"
              value={form.periodEnd}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create budget"}
          </button>
        </form>
      </section>

      <section className="budget-list-section">
        <h2>Your budgets</h2>

        {loading ? (
          <p>Loading budgets...</p>
        ) : budgets.length === 0 ? (
          <p>
            No budgets yet. Create your first budget using the form
            above.
          </p>
        ) : (
          <div className="budget-list">
            {budgets.map((budget) => {
              const spent = getSpent(budget)
              const limit = budget.amountInPaise
              const remaining = limit - spent
              const percentage =
                limit > 0 ? (spent / limit) * 100 : 0

              const categoryName = budget.categoryId
                ? typeof budget.categoryId === "object"
                  ? budget.categoryId.name
                  : expenseCategories.find(
                      (category) =>
                        category._id === budget.categoryId
                    )?.name || "Category"
                : "Overall expenses"

              return (
                <article
                  className="budget-card"
                  key={budget._id}
                >
                  <div className="budget-card-header">
                    <div>
                      <h3>{categoryName}</h3>

                      <p>
                        {formatDate(budget.periodStart)} –{" "}
                        {formatDate(budget.periodEnd)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(budget._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <p>
                    <strong>{formatMoney(spent)}</strong> spent of{" "}
                    {formatMoney(limit)}
                  </p>

                  <div
                    role="progressbar"
                    aria-label={`${categoryName} budget used`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.min(
                      100,
                      Math.round(percentage)
                    )}
                    style={{
                      height: "10px",
                      background: "#e5e7eb",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, percentage)}%`,
                        height: "100%",
                        background:
                          percentage >= 100
                            ? "#dc2626"
                            : percentage >= 80
                              ? "#d97706"
                              : "#16a34a",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>

                  <p>
                    {remaining >= 0
                      ? `${formatMoney(remaining)} remaining`
                      : `${formatMoney(Math.abs(remaining))} over budget`}
                  </p>

                  {percentage >= 80 && (
                    <p>
                      {percentage >= 100
                        ? "You have reached or exceeded this budget."
                        : "You are approaching this budget limit."}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}

export default Budgets
