import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

import AuthPage from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Budgets from "./pages/Budgets"
import Analytics from "./pages/Analytics"
import Insights from "./pages/Insights"
import Goals from "./pages/Goals"
import WhatIf from "./pages/WhatIf"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

function LoginRoute() {
  const location = useLocation()

  return <AuthPage key={location.pathname} mode="login" />
}

function RegisterRoute() {
  return <AuthPage mode="register" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/register" element={<RegisterRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/what-if" element={<WhatIf />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}