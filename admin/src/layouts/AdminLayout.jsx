import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navigationItems, navigationSymbols } from "../constants/navigation.js";

function AdminLayout({ page, setPage, orders, children, overlay }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    window.location.href =
      "https://www.ariyashop.in/login?redirect=admin";
  };

  return (
    <div className="app">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
   <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
    {sidebarOpen && (
  <button
    className="close-btn"
    onClick={() => setSidebarOpen(false)}
  >
    ✕
  </button>
)}
        <div className="brand">
          <span>A</span>

          <div>
            <b>ARIYA</b>
            <small>FINE JEWELLERY</small>
          </div>
        </div>

        <nav>
          {navigationItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setPage(item);
                setSidebarOpen(false);
              }}
              className={page === item ? "active" : ""}
            >
              <i>{navigationSymbols[item]}</i>

              <span>{item}</span>

              {item === "Orders" && orders && (
                <em>
                  {
                    orders.filter(
                      (o) =>
                        !["Delivered", "Cancelled"].includes(o.status)
                    ).length
                  }
                </em>
              )}
            </button>
          ))}

          <div className="divider" />

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            <i>↩</i>
            <span>Logout</span>
          </button>
        </nav>

        <div className="admin">
          <div>AK</div>

          <span>
            <b>Aisha Kapoor</b>
            <small>Store owner</small>
          </span>
        </div>
      </aside>

      {/* Main */}
      <main>
        <header>
          <div className="header-left">
            <button
  className="menu-btn"
  onClick={() => setSidebarOpen(true)}
  aria-label="Open menu"
>
  ☰
</button>

            <div>
              <small>ARIYA / ADMIN</small>
              <h1>{page}</h1>
            </div>
          </div>

          <div className="header-actions">
            <label>
              ⌕
              <input placeholder="Search anything…" />
            </label>

            <button className="icon">♢</button>

            <div className="avatar">AK</div>
          </div>
        </header>

        <section className="content">{children}</section>
      </main>

      {overlay}
    </div>
  );
}

export default AdminLayout;