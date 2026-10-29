# SpendWise — Smart Student Expense Tracker

**Spend wisely, not merely less.**

SpendWise is a student-focused personal finance management application designed to help students track income and expenses, understand spending patterns, manage budgets, and plan their financial goals.

Unlike a basic expense tracker, SpendWise aims to turn transaction records into meaningful insights that help students make more informed financial decisions.

## ✨ Features

### 💸 Transaction Management

* Record income and expenses.
* View transaction history.
* Edit and delete transactions.
* Search transactions by note or category.
* Filter transactions by type and payment method.

### 📊 Dashboard & Analytics

* View financial information based on transaction data.
* Explore category-wise spending.
* Monitor spending through visual progress indicators.
* Compare monthly spending patterns.

### 💰 Budget Management

* Create budgets for spending categories.
* Monitor spending against budget limits.
* View budget progress and manage existing budgets.

### 🎯 Savings Goals

* Create and manage financial goals.
* Track progress toward savings targets.

### 💡 Spending Insights & What-If Simulator

* Explore category-wise spending insights.
* Compare monthly spending.
* Experiment with hypothetical savings scenarios.
* Estimate how regular savings can accumulate over time.

### 🔐 Authentication & Account Management

* User registration and login.
* Password hashing.
* JWT-based authentication using HTTP-only cookies.
* Protected application routes.
* Profile and settings pages.

## 🛠️ Tech Stack

| Component         | Technologies                                       |
| ----------------- | -------------------------------------------------- |
| Frontend          | React, JavaScript, Vite, HTML5, CSS3               |
| Backend           | Node.js, Express.js                                |
| Database          | MongoDB, Mongoose                                  |
| Authentication    | JSON Web Tokens (JWT), HTTP-only cookies, bcryptjs |
| Development Tools | Git, GitHub, npm                                   |

## 🖥️ Application Screenshots

## 🖥️ Application Screenshots

### Dashboard
![SpendWise Dashboard](screenshots/Dashboard.png)

### Transaction Management
![SpendWise Transactions](screenshots/Transactions.png)

### Analytics
![SpendWise Analytics](screenshots/Analytics.png)

### Insights
![SpendWise Insights](screenshots/Insights.png)

### Budget Management
![SpendWise Budgets](screenshots/Budgets.png)

### Savings Goals
![SpendWise Goals](screenshots/Goals.png)

### What-If Calculator
![SpendWise What-If Calculator](screenshots/Whatif.png)

<!-- Add screenshots here when available. -->

## 🚀 Getting Started

### Prerequisites

* Node.js and npm
* MongoDB Atlas account or another compatible MongoDB instance
* Git

### 1. Clone the repository

```bash
git clone https://github.com/bhoomiptl/SpendWise.git
cd SpendWise
```

### 2. Set up the backend

```bash
cd server
npm install
```

The backend uses environment variables configured in `server/.env`:

| Variable     | Purpose                            |
| ------------ | ---------------------------------- |
| `PORT`       | Port used by the backend server    |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret used for JWT authentication |

Ensure these variables are configured in your existing `.env` file. Never commit actual credentials or secrets to GitHub.

### 3. Start the backend

From the `server` directory, run:

```bash
npm run dev
```

The backend starts in development mode using Node.js watch mode.

For standard startup, use:

```bash
npm start
```

### 4. Set up the frontend

Open a second terminal at the project root and run:

```bash
cd client
npm install
npm run dev
```

Vite will display the local frontend URL, usually:

`http://localhost:5173`

The backend is expected to run at:

`http://localhost:5000`

### Frontend API configuration

By default, the frontend sends requests to:

`http://localhost:5000/api`

To override this URL, create a `client/.env` file containing:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

This variable is optional for local development because the frontend already has a default API URL. Restart Vite after changing environment variables.

## 📁 Project Structure

```text
SpendWise/
├── client/       # React frontend
├── server/       # Express backend and API
├── docs/         # Project documentation
├── .gitignore
└── README.md
```

## 🎯 Project Vision

SpendWise aims to make financial awareness more accessible to students by helping them understand not only how much they spend, but also where their money goes.

The long-term vision is to encourage thoughtful spending, better budgeting habits, and more intentional financial planning.

## 🔮 Future Improvements

Potential improvements include:

* Richer interactive financial charts.
* Exportable transaction reports.
* Recurring transactions and reminders.
* Additional spending insights.
* Further improvements to mobile responsiveness.

## 👩‍💻 Developer

**Bhoomi Patel**

GitHub: [@bhoomiptl](https://github.com/bhoomiptl)

---

*Built as a student project to explore full-stack web development and practical personal finance management.*
