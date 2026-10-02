import { Navigate, Route, Routes } from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"
import Analytics from "./pages/Analytics"
import Insights from "./pages/Insights"
import Goals from "./pages/Goals"
import WhatIf from "./pages/WhatIf"

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/what-if" element={<WhatIf />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App