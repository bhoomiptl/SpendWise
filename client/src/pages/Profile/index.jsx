import { useAuth } from "../../context/AuthContext"

function Profile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Profile</h1>
        <p>Loading your account information...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-container">
        <h1>My Profile</h1>
        <p>Your account information is unavailable. Please log in again.</p>
      </div>
    )
  }

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <p>Your SpendWise account information.</p>

      <section className="profile-card">
        <div className="profile-avatar profile-page-avatar">
          {initials}
        </div>

        <h2>{user.name || "Student"}</h2>
        <p>{user.email || "No email available"}</p>

        <div className="profile-info-row">
          <span>Full Name</span>
          <strong>{user.name || "Not available"}</strong>
        </div>

        <div className="profile-info-row">
          <span>Email Address</span>
          <strong>{user.email || "Not available"}</strong>
        </div>

        <div className="profile-info-row">
          <span>Member Since</span>
          <strong>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Not available"}
          </strong>
        </div>
      </section>
    </div>
  )
}

export default Profile