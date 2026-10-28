import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"
import "./auth.css"

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register"

  const { user, loading, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return <div className="auth-loading">Loading SpendWise...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (isRegister) {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        })
        navigate("/", { replace: true })
      } else {
        await login({ email: email.trim(), password })

        const destination = location.state?.from || "/"
        navigate(destination, { replace: true })
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/login" className="auth-brand">
          SpendWise<span>.</span>
        </Link>

        <p className="auth-eyebrow">YOUR MONEY, MORE MINDFULLY</p>

        <h1>{isRegister ? "Create your account" : "Welcome back."}</h1>

        <p className="auth-description">
          {isRegister
            ? "Start understanding your spending, one decision at a time."
            : "Your financial journey continues here."}
        </p>

        {location.state?.message && !isRegister && (
          <div className="auth-success" role="status">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                maxLength={80}
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
            />
          </label>

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New to SpendWise?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>

        <p className="auth-footer">Spend wisely, not merely less.</p>
      </section>
    </main>
  )
}