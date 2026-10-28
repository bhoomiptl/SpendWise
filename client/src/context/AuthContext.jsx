import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { api } from "../api/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore the existing session when the app opens.
  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get("/auth/me")
      setUser(data.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  async function login(credentials) {
    const data = await api.post("/auth/login", credentials)

    setUser(data.user ?? null)
    await refreshUser()

    return data
  }

  async function register(details) {
    const data = await api.post("/auth/register", details)

    // Registration may or may not create a logged-in session.
    // Restore the session instead of assuming either behavior.
    await refreshUser()

    return data
  }

  async function logout() {
    try {
      await api.post("/auth/logout", {})
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}