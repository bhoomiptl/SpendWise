# SpendWise — Smart Student Expense Tracker

**Spend wisely, not merely less.**

SpendWise is a full-stack personal finance management application designed especially for students. It helps users track income and expenses, understand spending patterns, manage budgets, and plan savings goals.

Unlike a basic expense tracker, SpendWise focuses on turning transaction records into meaningful financial insights.

## 🚀 Live Demo

* **Application:** https://bhoomiptl.github.io/SpendWise/
* **Backend:** https://spendwise-backend-wdoz.onrender.com
* **Source Code:** https://github.com/bhoomiptl/SpendWise

## ✨ Features

### 💸 Transaction Management

* Record income and expenses.
* View transaction history.
* Add, edit, and delete transactions.
* Search transactions by note or category.
* Filter transactions by type and payment method.

### 📊 Dashboard & Analytics

* View income, expenses, and balance.
* Explore category-wise spending.
* Monitor spending through visual indicators.
* Compare monthly spending patterns.

### 💰 Budget Management

* Create budgets for spending categories.
* Monitor spending against budget limits.
* Track budget progress.

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

| Component      | Technologies                         |
| -------------- | ------------------------------------ |
| Frontend       | React, JavaScript, Vite, HTML5, CSS3 |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB, Mongoose                    |
| Authentication | JWT, HTTP-only cookies, bcryptjs     |
| Tools          | Git, GitHub, npm                     |

## 🖥️ Application Screenshots

## 🖥️ Application Screenshots

### Dashboard
![Dashboard](./screenshots/Dashboard.png)

### Analytics
![Analytics](./screenshots/Analytics.png)

### Transactions
![Transactions](./screenshots/Transactions.png)

### Budgets
![Budgets](./screenshots/Budgets.png)

### Goals
![Goals](./screenshots/Goals.png)

### Insights
![Insights](./screenshots/Insights.png)

### What-If Simulator
![What-If](./screenshots/Whatif.png)

## ⚙️ Local Installation

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

Create a `server/.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Never commit actual credentials or secrets to GitHub.

### 3. Start the backend

```bash
npm run dev
```

The backend runs locally on `http://localhost:5000`.

### 4. Set up the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Vite will display the local frontend URL, usually `http://localhost:5173`.

### Frontend API Configuration

For local development, the frontend defaults to:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Create a `client/.env` file if you need to override the default API URL. Restart Vite after changing environment variables.

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

Its goal is to encourage thoughtful spending, better budgeting habits, and more intentional financial planning.

## 🔮 Future Improvements

* Exportable transaction reports.
* Recurring transactions and reminders.
* Richer interactive financial charts.
* Additional spending insights.
* Further improvements to mobile responsiveness.

## 👩‍💻 Developer

**Bhoomi Patel**

GitHub: https://github.com/bhoomiptl

---

Built as a student project to explore full-stack web development and practical personal finance management.
