# SpendWise — Frontend

This directory contains the frontend of **SpendWise**, a student-focused personal finance management application.

Built with React and Vite, the frontend provides the interface for managing transactions, monitoring budgets, exploring spending insights, and tracking financial goals.

For the complete project overview and backend setup, see the [main README](../README.md).

## ✨ Frontend Features

* Dashboard with financial summaries.
* Income and expense transaction management.
* Transaction search and filtering.
* Category-wise spending analytics.
* Budget creation and progress tracking.
* Savings goal management.
* Spending insights and monthly comparisons.
* What-if savings calculator.
* Login and registration pages.
* Profile and account settings.
* Protected application pages.

## 🛠️ Technologies

* React
* JavaScript
* Vite
* HTML5
* CSS3
* Fetch API for backend communication

## 🚀 Getting Started

### Prerequisites

* Node.js and npm
* The SpendWise backend configured and running

### 1. Install dependencies

From the project root:

```bash
cd client
npm install
```

### 2. Configure the backend URL

The frontend uses the following default API URL:

`http://localhost:5000/api`

To override it, create a `.env` file inside the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

This environment variable is optional for local development.

### 3. Start the development server

Run:

```bash
npm run dev
```

Vite will display the local URL, usually:

`http://localhost:5173`

## 📂 Source Organization

The main application code is located in `src/`.

| Directory or File | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| `src/api/`        | Communication with the backend API                 |
| `src/components/` | Reusable interface components and layout           |
| `src/context/`    | Shared application state, including authentication |
| `src/pages/`      | Application pages                                  |
| `src/App.jsx`     | Application routing                                |
| `src/index.css`   | Global styles                                      |

## 🔒 Authentication

The frontend communicates with the backend using HTTP requests that include credentials where required. This allows browser requests to include authentication cookies.

Authentication and authorization are handled in coordination with the backend.

## 🔗 Related Documentation

* [Main project README](../README.md)
* [SpendWise GitHub repository](https://github.com/bhoomiptl/SpendWise)
