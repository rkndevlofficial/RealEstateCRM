import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import companyInfo from "../../data/companyInfo";

function AdminSidebar() {
  const location = useLocation();

  const [adminUser, setAdminUser] = useState({
    name: "Admin",
    email: "",
  });

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);

        setAdminUser({
          name: parsedAdmin.name || "Admin",
          email: parsedAdmin.email || "",
        });
      } catch (error) {
        console.log("Admin user parse error:", error);

        setAdminUser({
          name: "Admin",
          email: "",
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminSessionMessage");

    localStorage.setItem(
      "adminSessionMessage",
      "You have been logged out successfully."
    );

    window.location.replace("/admin");
  };

  const menuItem = (path, label, icon) => {
    const active =
      path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(path);

    return (
      <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
          active
            ? "bg-[#CDB52B] text-[#263238] shadow-lg"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-72 min-h-screen bg-[#263238] text-white flex flex-col border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-white/20">
            <img
              src={companyInfo.logo || "/aranyak-logo.png"}
              alt={companyInfo.name || "Aranyak Ventures"}
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-[#CDB52B] leading-tight">
              Admin CRM
            </h2>

            <p className="text-xs text-slate-400 mt-1 truncate">
              {companyInfo.name || "Aranyak Ventures"}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-5 space-y-2">
        {menuItem("/admin", "Dashboard", "📊")}
        {menuItem("/admin/projects", "Projects", "🏠")}
        {menuItem("/admin/leads", "Leads", "📞")}

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <span className="text-lg">🌐</span>
          <span>View Website</span>
        </Link>
      </nav>

      <div className="p-5 border-t border-white/10">
        <div className="bg-slate-900/70 rounded-2xl p-4 mb-4 border border-white/10">
          <p className="text-xs text-slate-400">Logged in as</p>

          <p className="font-extrabold mt-1 text-white truncate">
            {adminUser.name || "Admin"}
          </p>

          {adminUser.email && (
            <p className="text-xs text-slate-400 mt-1 truncate">
              {adminUser.email}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-xl font-extrabold shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;