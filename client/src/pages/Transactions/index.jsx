import { useEffect, useState } from "react"
import { api } from "../../api/api"

const paymentMethods = [
  "UPI",
  "Cash",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Other",
]

function formatDate(value) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function mapTransaction(transaction, categories) {
  const categoryId =
    typeof transaction.categoryId === "object"
      ? transaction.categoryId?._id
      : transaction.categoryId

  const category = categories.find(
    (item) => item._id === categoryId
  )

  const amount = transaction.amountInPaise / 100

  return {
    id: transaction._id,
    name: transaction.note?.trim() || "Untitled transaction",
    category: category?.name || "Uncategorized",
    date: formatDate(transaction.date),
    paymentMethod: transaction.paymentMethod,
    amount:
      transaction.type === "income"
        ? amount
        : -amount,
  }
}

function Transactions() {
  const [transactionType, setTransactionType] = useState("expense")
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    date: "",
    paymentMethod: "UPI",
    note: "",
  })

  const availableCategories = categories.filter(
    (category) => category.type === transactionType
  )
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "income" && transaction.amount > 0) ||
      (typeFilter === "expense" && transaction.amount < 0)

    const matchesPayment =
      paymentFilter === "all" ||
      transaction.paymentMethod === paymentFilter

    return matchesSearch && matchesType && matchesPayment
  })
  function resetForm() {
  setEditingId(null)
  setTransactionType("expense")

  const firstExpenseCategory = categories.find(
    (category) => category.type === "expense"
  )

  setFormData({
    amount: "",
    categoryId: firstExpenseCategory?._id || "",
    date: "",
    paymentMethod: "UPI",
    note: "",
  })

  setError("")
}

  async function loadData(showLoading = true) {
    if (showLoading) setLoading(true)

    setError("")

    try {
      const [categoryResponse, transactionResponse] =
        await Promise.all([
          api.get("/categories"),
          api.get("/transactions"),
        ])

      const fetchedCategories = categoryResponse.categories || []
      const fetchedTransactions = transactionResponse.transactions || []

      setCategories(fetchedCategories)

      setTransactions(
        fetchedTransactions.map((transaction) =>
          mapTransaction(transaction, fetchedCategories)
        )
      )

      setFormData((current) => {
        const matchingCategory = fetchedCategories.find(
          (category) =>
            category._id === current.categoryId &&
            category.type === transactionType
        )

        const defaultCategory = fetchedCategories.find(
          (category) => category.type === transactionType
        )

        return {
          ...current,
          categoryId: (
            matchingCategory || defaultCategory
          )?._id || "",
        }
      })
    } catch (err) {
      setError(err.message || "Unable to load transactions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleTypeChange = (type) => {
    setTransactionType(type)

    const firstCategory = categories.find(
      (category) => category.type === type
    )

    setFormData((current) => ({
      ...current,
      categoryId: firstCategory?._id || "",
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }
  const handleSubmit = async (event) => {
  event.preventDefault()

  const amount = Number(formData.amount)

  if (!Number.isFinite(amount) || amount <= 0) {
    setError("Please enter a valid amount.")
    return
  }

  const amountInPaise = Math.round(amount * 100)

  if (
    !Number.isSafeInteger(amountInPaise) ||
    amountInPaise < 1
  ) {
    setError("Please enter a valid amount.")
    return
  }

  const selectedCategory = categories.find(
    (category) =>
      category._id === formData.categoryId &&
      category.type === transactionType
  )

  if (!selectedCategory) {
    setError(
      `No ${transactionType} category is available. Please check your categories.`
    )
    return
  }

  setSaving(true)
  setError("")

  try {
    const payload = {
      categoryId: selectedCategory._id,
      type: transactionType,
      amountInPaise,
      ...(formData.date ? { date: formData.date } : {}),
      paymentMethod: formData.paymentMethod,
      note: formData.note.trim(),
    }

    if (editingId) {
      await api.put(`/transactions/${editingId}`, payload)
    } else {
      await api.post("/transactions", payload)
    }

    resetForm()
    await loadData(false)
  } catch (err) {
    setError(
      err.message ||
        `Unable to ${editingId ? "update" : "save"} the transaction.`
    )
  } finally {
    setSaving(false)
  }
}
const handleEdit = async (id) => {
  setError("")

  try {
    const response = await api.get(`/transactions/${id}`)
    const transaction = response.transaction

    if (!transaction) {
      setError("Transaction not found.")
      return
    }

    const categoryId =
      typeof transaction.categoryId === "object"
        ? transaction.categoryId?._id
        : transaction.categoryId

    const date = transaction.date
      ? new Date(transaction.date)
      : null

    setEditingId(transaction._id)
    setTransactionType(transaction.type)

    setFormData({
      amount: String(transaction.amountInPaise / 100),
      categoryId: categoryId || "",
      date: date && !Number.isNaN(date.getTime())
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        : "",
      paymentMethod: transaction.paymentMethod || "UPI",
      note: transaction.note || "",
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  } catch (err) {
    setError(err.message || "Unable to load transaction for editing.")
  }
}
  const handleDelete = async (id) => {
    const transaction = transactions.find(
      (item) => item.id === id
    )

    if (!transaction) return

    const confirmed = window.confirm(
      `Delete "${transaction.name}"?`
    )

    if (!confirmed) return

    setError("")

    try {
      await api.delete(`/transactions/${id}`)

      setTransactions((current) =>
        current.filter((item) => item.id !== id)
      )
    } catch (err) {
      setError(err.message || "Unable to delete the transaction.")
    }
  }

  return (
    <section className="page transactions-page">
      <div className="transactions-header">
        <div>
          <p className="page-eyebrow">Money movement</p>
          <h1>Transactions</h1>
          <p className="page-description">
            Track where your money comes from and where it goes.
          </p>
        </div>
      </div>

      <section className="transaction-form-card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">Track money</p>
            <h2>{editingId ? "Edit transaction" : "Add transaction"}</h2>
          </div>
        </div>

        <div className="transaction-type-toggle">
          <button
            type="button"
            className={
              transactionType === "expense"
                ? "type-button active"
                : "type-button"
            }
            onClick={() => handleTypeChange("expense")}
          >
            Expense
          </button>

          <button
            type="button"
            className={
              transactionType === "income"
                ? "type-button active"
                : "type-button"
            }
            onClick={() => handleTypeChange("income")}
          >
            Income
          </button>
        </div>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="amount">Amount</label>

            <div className="amount-input">
              <span>₹</span>

              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="categoryId">Category</label>

            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={availableCategories.length === 0}
            >
              {availableCategories.length === 0 ? (
                <option value="">
                  No categories available
                </option>
              ) : (
                availableCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="date">Date</label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="paymentMethod">Payment method</label>

            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field form-field-full">
            <label htmlFor="note">Note</label>

            <input
              id="note"
              name="note"
              type="text"
              maxLength="200"
              placeholder="e.g. Lunch with friends"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={
                saving ||
                loading ||
                availableCategories.length === 0
              }
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add transaction"}
            </button>
            {editingId && (
              <button
                className="button"
                type="button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="transactions-list-section">
        <div className="transaction-filters">
              <input
                type="search"
                placeholder="Search by note or category..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search transactions"
              />

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                aria-label="Filter by transaction type"
              >
                <option value="all">All transactions</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                aria-label="Filter by payment method"
              >
                <option value="all">All payment methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">History</p>
            <h2>Recent transactions</h2>
          </div>

          <span className="transaction-count">
            {transactions.length} transactions
          </span>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <div className="transactions-table">
            <div className="transaction-table-header">
              <span>Transaction</span>
              <span>Category</span>
              <span>Payment</span>
              <span>Date</span>
              <span>Amount</span>
              <span></span>
            </div>
          {filteredTransactions.length === 0 ? (
              <p>
                No matching transactions found. Try changing your search or filters.
              </p>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  className="transaction-table-row"
                  key={transaction.id}
                >
                  <div className="transaction-name">
                    <strong>{transaction.name}</strong>
                  </div>

                  <span>{transaction.category}</span>

                  <span>{transaction.paymentMethod}</span>

                  <span>{transaction.date}</span>

                  <strong
                    className={
                      transaction.amount > 0
                        ? "amount-positive"
                        : "amount-negative"
                    }
                  >
                    {transaction.amount > 0 ? "+" : "-"}₹
                    {Math.abs(transaction.amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </strong>

                  <div className="transaction-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(transaction.id)}
                      disabled={saving}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(transaction.id)}
                      aria-label={`Delete ${transaction.name}`}
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </section>
  )
};
export default Transactions