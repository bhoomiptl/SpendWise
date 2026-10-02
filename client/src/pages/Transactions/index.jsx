import { useState } from "react"

const categories = {
  expense: [
    "Food",
    "Education",
    "Books",
    "Stationery",
    "Transport",
    "Rent",
    "Health",
    "Entertainment",
    "Shopping",
    "Skills",
    "Other",
  ],
  income: [
    "Parents / Family",
    "Scholarship",
    "Internship",
    "Part-time",
    "Freelance",
    "Gift",
    "Refund",
    "Other",
  ],
}

const paymentMethods = [
  "UPI",
  "Cash",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Other",
]

const initialTransactions = [
  {
    id: 1,
    name: "Mess payment",
    category: "Food",
    date: "Today",
    paymentMethod: "UPI",
    amount: -850,
  },
  {
    id: 2,
    name: "Course subscription",
    category: "Education",
    date: "Yesterday",
    paymentMethod: "UPI",
    amount: -499,
  },
  {
    id: 3,
    name: "Pocket money",
    category: "Parents / Family",
    date: "Sep 28",
    paymentMethod: "UPI",
    amount: 5000,
  },
  {
    id: 4,
    name: "Auto fare",
    category: "Transport",
    date: "Sep 27",
    paymentMethod: "Cash",
    amount: -120,
  },
]

function Transactions() {
  const [transactionType, setTransactionType] = useState("expense")
  const [transactions, setTransactions] = useState(initialTransactions)

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    date: "",
    paymentMethod: "UPI",
    note: "",
  })

  const handleTypeChange = (type) => {
    setTransactionType(type)

    setFormData((current) => ({
      ...current,
      category: categories[type][0],
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const amount = Number(formData.amount)

    if (!amount || amount <= 0) {
      return
    }

    const newTransaction = {
      id: Date.now(),
      name: formData.note.trim() || "Untitled transaction",
      category: formData.category,
      date: formData.date || "Today",
      paymentMethod: formData.paymentMethod,
      amount: transactionType === "income" ? amount : -amount,
    }

    setTransactions((current) => [newTransaction, ...current])

    setFormData({
      amount: "",
      category: categories[transactionType][0],
      date: "",
      paymentMethod: "UPI",
      note: "",
    })
  }

  const handleDelete = (id) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    )
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
            <h2>Add transaction</h2>
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
                min="1"
                step="1"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories[transactionType].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
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
              placeholder="e.g. Lunch with friends"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              className="button button-primary"
              type="submit"
            >
              Add transaction
            </button>
          </div>
        </form>
      </section>

      <section className="transactions-list-section">
        <div className="section-heading">
          <div>
            <p className="card-eyebrow">History</p>
            <h2>Recent transactions</h2>
          </div>

          <span className="transaction-count">
            {transactions.length} transactions
          </span>
        </div>

        <div className="transactions-table">
          <div className="transaction-table-header">
            <span>Transaction</span>
            <span>Category</span>
            <span>Payment</span>
            <span>Date</span>
            <span>Amount</span>
            <span></span>
          </div>

          {transactions.map((transaction) => (
            <div className="transaction-table-row" key={transaction.id}>
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
                {Math.abs(transaction.amount).toLocaleString("en-IN")}
              </strong>

              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(transaction.id)}
                aria-label={`Delete ${transaction.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default Transactions