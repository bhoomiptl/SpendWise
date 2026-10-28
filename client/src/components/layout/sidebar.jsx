import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navigationItems = [
{ label: "Dashboard", path: "/" },
{ label: "Transactions", path: "/transactions" },
{ label: "Budgets", path: "/budgets" },
{ label: "Analytics", path: "/analytics" },
{ label: "Insights", path: "/insights" },
{ label: "Goals", path: "/goals" },
{ label: "What-If", path: "/what-if" },
]

function Sidebar() {
const { logout } = useAuth()
const navigate = useNavigate()

async function handleLogout() {
try {
await logout()
} finally {
navigate("/login", { replace: true })
}
}

return ( <aside className="sidebar"> <div className="sidebar-brand"> <div> <h2>SpendWise</h2> <p>Smart money management</p> </div> </div>

  <nav className="sidebar-nav">
    {navigationItems.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        {item.label}
      </NavLink>
    ))}
  </nav>

  <div className="sidebar-footer">
    <p>Spend wisely, not merely less.</p>

    <button
      type="button"
      className="nav-link logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</aside>

)
}

export default Sidebar
