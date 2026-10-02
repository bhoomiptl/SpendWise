const summaryCards = [
  {
    label: "Balance",
    value: "₹12,450",
    helper: "Available this month",
  },
  {
    label: "Income",
    value: "₹20,000",
    helper: "Money received",
  },
  {
    label: "Expenses",
    value: "₹7,550",
    helper: "Money spent",
  },
]

const spendingCategories = [
  { name: "Food", amount: "₹2,400", percentage: 32 },
  { name: "Education", amount: "₹1,500", percentage: 20 },
  { name: "Transport", amount: "₹950", percentage: 13 },
  { name: "Entertainment", amount: "₹700", percentage: 9 },
]

const recentTransactions = [
  {
    name: "Mess payment",
    category: "Food",
    date: "Today",
    amount: "-₹850",
  },
  {
    name: "Course subscription",
    category: "Education",
    date: "Yesterday",
    amount: "-₹499",
  },
  {
    name: "Pocket money",
    category: "Parents / Family",
    date: "Sep 28",
    amount: "+₹5,000",
  },
  {
    name: "Auto fare",
    category: "Transport",
    date: "Sep 27",
    amount: "-₹120",
  },
]

function Dashboard() {
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

        <button className="button button-primary" type="button">
          + Add transaction
        </button>
      </div>

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
            <span className="card-total">₹7,550</span>
          </div>

          <div className="category-list">
            {spendingCategories.map((category) => (
              <div className="category-item" key={category.name}>
                <div className="category-info">
                  <span>{category.name}</span>
                  <strong>{category.amount}</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
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
            {recentTransactions.map((transaction) => (
              <div className="transaction-item" key={`${transaction.name}-${transaction.date}`}>
                <div>
                  <strong>{transaction.name}</strong>
                  <span>
                    {transaction.category} · {transaction.date}
                  </span>
                </div>

                <strong
                  className={
                    transaction.amount.startsWith("+")
                      ? "amount-positive"
                      : "amount-negative"
                  }
                >
                  {transaction.amount}
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default Dashboard