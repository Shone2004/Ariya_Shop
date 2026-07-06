import { useNavigate } from "react-router-dom";
import { navigationItems, navigationSymbols } from "../constants/navigation.js";

function AdminLayout({ page, setPage, orders, children, overlay }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin login data
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    // Redirect to customer website
    window.location.href = "https://ariya-shop.vercel";
  };

  return (
    <div className="app">
      <aside>
        <div className="brand">
          <span>A</span>
          <div>
            <b>ARIYA</b>
            <small>FINE JEWELLERY</small>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {navigationItems.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={page === item ? "active" : ""}
            >
              <i>{navigationSymbols[item]}</i>
              {item}

              {item === "Orders" && orders && (
                <em>
                  {
                    orders.filter(
                      (o) => !["Delivered", "Cancelled"].includes(o.status)
                    ).length
                  }
                </em>
              )}
            </button>
          ))}

          <div
            style={{
              height: "1px",
              background: "#eee",
              margin: "8px 0",
            }}
          />

          <button
            onClick={handleLogout}
            style={{
              color: "#e05252",
              cursor: "pointer",
            }}
          >
            <i>↩</i> Logout
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

      <main>
        <header>
          <div>
            <small>ARIYA / ADMIN</small>
            <h1>{page}</h1>
          </div>

          <div className="header-actions">
            <label>
              ⌕ <input placeholder="Search anything…" />
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