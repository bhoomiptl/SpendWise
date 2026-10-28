import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate("/login", { replace: true })
    }
  }

  return (
    <div className="page-container">
      <h1>Settings</h1>
      <p>Manage your SpendWise account preferences.</p>

      <section className="profile-card">
        <h2>Account Information</h2>
        <div className="profile-info-row">
          <span>Email</span>
          <strong>{user?.email || "Not available"}</strong>
        </div>

        <div className="profile-info-row">
          <span>Appearance</span>
          <strong>Default green theme</strong>
        </div>

        <div className="profile-info-row">
          <span>Account Security</span>
          <strong>Protected login</strong>
        </div>

        <button
          type="button"
          className="delete-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </section>
    </div>
  )
}

export default Settings