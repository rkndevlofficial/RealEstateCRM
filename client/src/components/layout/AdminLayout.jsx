import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import companyInfo from "../../data/companyInfo";

function AdminLayout({ children }) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const AUTO_LOGOUT_TIME = 20 * 60 * 1000;
  const ACTIVITY_THROTTLE = 30 * 1000;

  const clearAdminSession = (message) => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminSessionMessage");

    if (message) {
      localStorage.setItem("adminSessionMessage", message);
    }

    window.location.replace("/admin");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    clearAdminSession("You have been logged out successfully.");
  };

  const handleAutoLogout = () => {
    clearAdminSession(
      "You were logged out due to inactivity. Please login again."
    );
  };

  const updateActivity = () => {
    const now = Date.now();

    if (now - lastActivityRef.current < ACTIVITY_THROTTLE) {
      return;
    }

    lastActivityRef.current = now;
    localStorage.setItem("adminLastActivity", String(now));

    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      clearAdminSession("Please login to continue.");
      return;
    }

    localStorage.setItem("adminLastActivity", String(Date.now()));

    logoutTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, AUTO_LOGOUT_TIME);

    const activityEvents = [
      "click",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, updateActivity, {
        passive: true,
      });
    });

    const checkActivityInterval = setInterval(() => {
      const lastActivity = Number(
        localStorage.getItem("adminLastActivity") || Date.now()
      );

      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= AUTO_LOGOUT_TIME) {
        handleAutoLogout();
      }
    }, 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastActivity = Number(
          localStorage.getItem("adminLastActivity") || Date.now()
        );

        const inactiveTime = Date.now() - lastActivity;

        if (inactiveTime >= AUTO_LOGOUT_TIME) {
          handleAutoLogout();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      clearInterval(checkActivityInterval);

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, updateActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const navLink = (path, label) => {
    const active =
      path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(path);

    return (
      <Link
        to={path}
        onClick={() => setMenuOpen(false)}
        className={`px-4 py-2.5 rounded-full font-semibold transition ${
          active
            ? "bg-[#CDB52B] text-[#263238]"
            : "text-white/75 hover:bg-white/10 hover:text-[#CDB52B]"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F6EF] text-[#263238]">
      <header className="sticky top-0 z-50 bg-[#35434A] text-white border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 min-w-0"
            >
              {companyInfo.logo ? (
                <div className="bg-white rounded-2xl px-3 py-2 shadow-md shrink-0">
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name || "Aranyak Ventures"}
                    className="h-9 sm:h-11 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-[#CDB52B] text-[#263238] flex items-center justify-center font-extrabold">
                  A
                </div>
              )}

              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#CDB52B] truncate">
                  Aranyak CRM
                </h2>

                <p className="text-xs text-white/55 truncate">
                  Real Estate Management
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex flex-wrap items-center gap-3">
              {navLink("/admin", "Dashboard")}
              {navLink("/admin/projects", "Projects")}
              {navLink("/admin/leads", "Leads")}
              {navLink("/admin/activity-logs", "Activity")}
              {navLink("/admin/profile", "Profile")}

              <Link
                to="/"
                className="px-4 py-2.5 rounded-full text-white/75 hover:bg-white/10 hover:text-[#CDB52B] font-semibold transition"
              >
                View Website
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Logout
              </button>
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle admin menu"
              className="lg:hidden w-11 h-11 rounded-full bg-white/10 border border-white/15 text-[#CDB52B] flex items-center justify-center text-2xl"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>

          {menuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-white/10 grid gap-3">
              {navLink("/admin", "Dashboard")}
              {navLink("/admin/projects", "Projects")}
              {navLink("/admin/leads", "Leads")}
              {navLink("/admin/activity-logs", "Activity Logs")}
              {navLink("/admin/profile", "Profile")}

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-2xl bg-white/5 text-white/80 hover:bg-white/10 hover:text-[#CDB52B] font-semibold transition"
              >
                View Website
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition text-left"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

export default AdminLayout;