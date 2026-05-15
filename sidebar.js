// sidebar.js — include this in every page with <script src="sidebar.js"></script>

(function () {

  // ── Auth Guard ────────────────────────────────
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("login.html");
    return;
  }

  // ── Disable bfcache (back-forward cache) ──────
  // Having an 'unload' listener forces the browser to NOT store
  // this page in bfcache, so pressing Back fully reloads the page
  // (which re-runs the auth guard above and redirects to login).
  window.addEventListener("unload", function () {});

  // ── Catch any edge-case back/forward navigations ──
  window.addEventListener("pageshow", function (e) {
    if (!localStorage.getItem("token")) {
      window.location.replace("login.html");
    }
  });

  // ── Attach token to all fetch requests ─────────
  // Override global fetch to always send Authorization header
  const originalFetch = window.fetch;
  window.fetch = function (url, options = {}) {
    options.headers = options.headers || {};
    options.headers["Authorization"] = `Bearer ${token}`;
    return originalFetch(url, options).then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.replace("login.html");
      }
      return response;
    });
  };

  // ── Also patch axios if available ────────────
  if (window.axios) {
    window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    window.axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.replace("login.html");
        }
        return Promise.reject(err);
      }
    );
  } else {
    // axios might load after sidebar.js — patch after DOM ready
    document.addEventListener("DOMContentLoaded", () => {
      if (window.axios) {
        window.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.axios.interceptors.response.use(
          res => res,
          err => {
            if (err.response?.status === 401) {
              localStorage.removeItem("token");
              window.location.replace("login.html");
            }
            return Promise.reject(err);
          }
        );
      }
    });
  }

  // ── Inject Styles ─────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }

    body {
      background: #f0f4f8;
      font-family: 'DM Sans', sans-serif;
      color: #1e293b;
    }

    #sidebar {
      position: fixed;
      top: 0; left: 0;
      height: 100vh;
      width: 240px;
      background: #1e3a5f;
      border-right: 1px solid #1a3354;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: width 0.3s ease;
      overflow: hidden;
      box-shadow: 2px 0 8px rgba(0,0,0,0.08);
    }

    #sidebar.collapsed { width: 64px; }

    #sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid #1a3354;
      white-space: nowrap;
      overflow: hidden;
      background: #162f4f;
    }

    #sidebar-logo .logo-icon { font-size: 1.5rem; flex-shrink: 0; }
    #sidebar-logo .logo-text {
      font-family: 'Playfair Display', serif;
      color: #93c5fd;
      font-size: 1rem;
      font-weight: 700;
      transition: opacity 0.2s;
      white-space: nowrap;
    }
    #sidebar.collapsed .logo-text { opacity: 0; pointer-events: none; }

    #sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #2a4a6f transparent;
    }
    #sidebar-nav::-webkit-scrollbar { width: 4px; }
    #sidebar-nav::-webkit-scrollbar-track { background: transparent; }
    #sidebar-nav::-webkit-scrollbar-thumb { background: #2a4a6f; border-radius: 4px; }
    #sidebar-nav::-webkit-scrollbar-thumb:hover { background: #3b6a9f; }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #93c5fd;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      white-space: nowrap;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      border: 1px solid transparent;
    }

    .sidebar-link:hover { background: #1e4976; color: #ffffff; }
    .sidebar-link.active { background: #2563eb; color: #ffffff; border-color: #3b82f655; }

    .sidebar-link .link-icon { font-size: 1rem; flex-shrink: 0; width: 20px; text-align: center; }
    .sidebar-link .link-label { transition: opacity 0.2s; }
    #sidebar.collapsed .link-label { opacity: 0; pointer-events: none; width: 0; }

    #sidebar-bottom {
      padding: 8px;
      border-top: 1px solid #1a3354;
    }

    #logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #f87171;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      white-space: nowrap;
      cursor: pointer;
      border: 1px solid transparent;
      background: none;
      width: 100%;
      transition: background 0.2s, color 0.2s;
    }
    #logout-btn:hover { background: #7f1d1d33; color: #fca5a5; }
    #logout-btn .link-label { transition: opacity 0.2s; }
    #sidebar.collapsed #logout-btn .link-label { opacity: 0; pointer-events: none; width: 0; }

    #sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      border-top: 1px solid #1a3354;
      cursor: pointer;
      color: #64748b;
      transition: color 0.2s;
      background: none;
      border-left: none;
      border-right: none;
      border-bottom: none;
      width: 100%;
    }
    #sidebar-toggle:hover { color: #93c5fd; }
    #sidebar-toggle i { transition: transform 0.3s; font-size: 1rem; }
    #sidebar.collapsed #sidebar-toggle i { transform: rotate(180deg); }

    /* Push page content */
    #page-content {
      margin-left: 240px;
      transition: margin-left 0.3s ease;
      min-height: 100vh;
      background: #f0f4f8;
    }
    #page-content.collapsed { margin-left: 64px; }

    /* Tooltip on collapsed */
    .sidebar-link { position: relative; }
    #sidebar.collapsed .sidebar-link:hover::after {
      content: attr(data-label);
      position: absolute;
      left: 56px;
      top: 50%;
      transform: translateY(-50%);
      background: #1e3a5f;
      border: 1px solid #1a3354;
      color: #e2e8f0;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      z-index: 9999;
      pointer-events: none;
    }

    /* Admin badge */
    #admin-badge {
      padding: 10px 16px;
      border-bottom: 1px solid #1a3354;
      white-space: nowrap;
      overflow: hidden;
    }
    #admin-badge p {
      font-size: 0.72rem;
      color: #64748b;
      font-family: 'DM Sans', sans-serif;
    }
    #admin-badge span {
      font-size: 0.82rem;
      color: #93c5fd;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
    }
    #sidebar.collapsed #admin-badge { display: none; }
  `;
  document.head.appendChild(style);

  // ── Build Sidebar HTML ────────────────────────
  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";

  const links = [
    { icon: "🏨", label: "View Hotels",   href: "index.html" },
    { icon: "➕", label: "Add Hotel",      href: "add-hotel.html" },
    { icon: "🧾", label: "Vouchers",       href: "voucher.html" },
    { icon: "📦", label: "Package Cost",   href: "package-cost.html" },
    { icon: "📋", label: "Reservations",   href: "reservations.html" },
    { icon: "🧾", label: "Invoice",         href: "invoices.html" },
    { icon: "💵", label: "Cash Receipt",   href: "cash-receipt.html" },
    { icon: "🧮", label: "Allowance/Expense </br>Calculator", href: "calculator-landing.html" },
    { icon: "📒", label: "Ledger", href: "ledger.html" },
    { icon: "📖", label: "Bookings", href: "bookings.html" },
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  sidebar.innerHTML = `
    <!-- Logo -->
    <div id="sidebar-logo">
      <span class="logo-icon">🏨</span>
      <span class="logo-text">Aspiration Asia</span>
    </div>

    <!-- Admin Badge -->
    <div id="admin-badge">
      <p>Logged in as</p>
      <span>👤 Admin</span>
    </div>

    <!-- Nav Links -->
    <nav id="sidebar-nav">
      ${links.map(link => `
        <a href="${link.href}"
           class="sidebar-link ${currentPage === link.href ? "active" : ""}"
           data-label="${link.label}">
          <span class="link-icon">${link.icon}</span>
          <span class="link-label">${link.label}</span>
        </a>
      `).join("")}
    </nav>

    <!-- Bottom: Logout + Toggle -->
    <div id="sidebar-bottom">
      <button id="logout-btn" onclick="handleLogout()" data-label="Logout">
        <span class="link-icon">➜]</span>
        <span class="link-label">Logout</span>
      </button>
    </div>

    <!-- Toggle -->
    <button id="sidebar-toggle" title="Toggle Sidebar">
      <i class="fa fa-chevron-left"></i>
    </button>
  `;

  document.body.prepend(sidebar);

  // ── Wrap Page Content ─────────────────────────
  const children = Array.from(document.body.children).filter(el => el.id !== "sidebar");
  const wrapper = document.createElement("div");
  wrapper.id = "page-content";
  children.forEach(el => wrapper.appendChild(el));
  document.body.appendChild(wrapper);

  // ── Toggle Logic ──────────────────────────────
  const toggleBtn = document.getElementById("sidebar-toggle");
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  if (isCollapsed) {
    sidebar.classList.add("collapsed");
    wrapper.classList.add("collapsed");
  }

  toggleBtn.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("collapsed");
    wrapper.classList.toggle("collapsed", collapsed);
    localStorage.setItem("sidebarCollapsed", collapsed);
  });

  // ── Logout ────────────────────────────────────
  window.handleLogout = function () {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");

      // Overwrite every entry in the history stack with login.html
      // so pressing Back never shows a protected page URL.
      const len = window.history.length;
      for (let i = 0; i < len + 10; i++) {
        window.history.pushState(null, "", "login.html");
      }
      window.location.replace("login.html");
    }
  };

})();