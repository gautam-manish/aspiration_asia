// sidebar.js — include this in every page with <script src="sidebar.js"></script>

(function () {

  // ── Inject Styles ─────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    * { box-sizing: border-box; }

    #sidebar {
      position: fixed;
      top: 0; left: 0;
      height: 100vh;
      width: 240px;
      background: #111;
      border-right: 1px solid #2a2a2a;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: width 0.3s ease;
      overflow: hidden;
    }

    #sidebar.collapsed { width: 64px; }

    #sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 16px;
      border-bottom: 1px solid #2a2a2a;
      white-space: nowrap;
      overflow: hidden;
    }

    #sidebar-logo .logo-icon { font-size: 1.6rem; flex-shrink: 0; }
    #sidebar-logo .logo-text {
      font-family: 'Playfair Display', serif;
      color: #c9a84c;
      font-size: 1rem;
      font-weight: 700;
      transition: opacity 0.2s;
    }
    #sidebar.collapsed .logo-text { opacity: 0; pointer-events: none; }

    #sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #aaa;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      white-space: nowrap;
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
    }

    .sidebar-link:hover { background: #1e1e1e; color: #fff; }

    .sidebar-link.active {
      background: #1e1a0f;
      color: #c9a84c;
      border: 1px solid #c9a84c33;
    }

    .sidebar-link .link-icon { font-size: 1.1rem; flex-shrink: 0; width: 20px; text-align: center; }
    .sidebar-link .link-label { transition: opacity 0.2s; }
    #sidebar.collapsed .link-label { opacity: 0; pointer-events: none; width: 0; }

    #sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-top: 1px solid #2a2a2a;
      cursor: pointer;
      color: #555;
      transition: color 0.2s;
      background: none;
      border-left: none;
      border-right: none;
      border-bottom: none;
      width: 100%;
    }
    #sidebar-toggle:hover { color: #c9a84c; }
    #sidebar-toggle i { transition: transform 0.3s; font-size: 1rem; }
    #sidebar.collapsed #sidebar-toggle i { transform: rotate(180deg); }

    /* Push page content */
    #page-content {
      margin-left: 240px;
      transition: margin-left 0.3s ease;
      min-height: 100vh;
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
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      color: #f0f0f0;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      white-space: nowrap;
      z-index: 9999;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // ── Build Sidebar HTML ────────────────────────
  const sidebar = document.createElement("div");
  sidebar.id = "sidebar";

  const links = [
    { icon: "🏨", label: "View Hotels",       href: "index.html" },
    { icon: "➕", label: "Add Hotel",          href: "add-hotel.html" },
    { icon: "🧾", label: "Voucher",            href: "voucher.html" },
    { icon: "📦", label: "Package Cost",       href: "package-cost.html" },
    { icon: "📋", label: "Hotel Reservation", href: "reservations.html" },
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  sidebar.innerHTML = `
    <!-- Logo -->
    <div id="sidebar-logo">
      <span class="logo-icon">🏨</span>
      <span class="logo-text">Hotel Collection</span>
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

    <!-- Toggle Button -->
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

})();