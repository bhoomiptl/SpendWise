import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"
import ProfileMenu from "./ProfileMenu"

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="app-header">
          <ProfileMenu />
        </header>

        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout