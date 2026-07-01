import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../config/api";
import companyInfo from "../data/companyInfo";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function AdminEntry() {
  const [checking, setChecking] = useState(true);
  const [isInstalledApp, setIsInstalledApp] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const companyName = companyInfo.name || "Aranyak Ventures";

  const checkIsInstalledApp = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  };

  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        const installed = checkIsInstalledApp();

        setIsInstalledApp(installed);

        // Browser me login/dashboard nahi dikhana
        if (!installed) {
          setIsAuthorized(false);
          setChecking(false);
          return;
        }

        // App me token check hoga
        const token = localStorage.getItem("token");

        if (!token || token === "undefined" || token === "null") {
          localStorage.removeItem("token");
          setIsAuthorized(false);
          setChecking(false);
          return;
        }

        await API.get("/auth/me");

        setIsAuthorized(true);
      } catch (error) {
        console.log("Admin verify error:", error);
        localStorage.removeItem("token");
        setIsAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdminAccess();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F6EF] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-3xl px-6 py-5 shadow-xl border border-slate-100 w-fit mx-auto">
            <img
              src={companyInfo.logo || "/aranyak-logo.png"}
              alt={companyName}
              className="h-20 sm:h-24 w-auto object-contain"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263238] mt-6">
            {companyName}
          </h1>

          <p className="text-[#9CA83A] font-bold mt-2">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  // Installed app + valid token = Dashboard
  if (isInstalledApp && isAuthorized) {
    return <AdminDashboard />;
  }

  // Installed app + no token = Login page
  if (isInstalledApp && !isAuthorized) {
    return <AdminLogin />;
  }

  // Browser /admin = Sirf logo + name + cards
  return (
    <div className="min-h-screen bg-[#F7F6EF] flex items-center justify-center px-2 sm:px-4 py-6 sm:py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="w-full max-w-5xl"
      >
        <div className="bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-linear-to-r from-[#35434A] to-[#263238] px-5 sm:px-10 py-12 sm:py-16 text-center text-white">
            <div className="inline-flex bg-white rounded-3xl px-5 sm:px-8 py-4 sm:py-5 shadow-xl border border-white/30">
              <img
                src={companyInfo.logo || "/aranyak-logo.png"}
                alt={companyName}
                className="h-16 sm:h-24 w-auto object-contain"
              />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mt-8 leading-tight">
              {companyName} Admin CRM
            </h1>

            <p className="text-white/70 mt-4 text-base sm:text-xl">
              Private admin CRM access for managing projects and leads.
            </p>
          </div>

          <div className="px-5 sm:px-10 py-10 sm:py-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              <div className="bg-[#F7F6EF] rounded-3xl p-6 sm:p-8 text-center border border-[#CDB52B]/25">
                <div className="text-4xl sm:text-5xl">⬇️</div>

                <h3 className="font-extrabold text-[#263238] mt-4 text-xl sm:text-2xl">
                  Install
                </h3>

                <p className="text-slate-500 mt-2 text-base sm:text-lg">
                  Open as admin app
                </p>
              </div>

              <div className="bg-[#F7F6EF] rounded-3xl p-6 sm:p-8 text-center border border-[#CDB52B]/25">
                <div className="text-4xl sm:text-5xl">🔐</div>

                <h3 className="font-extrabold text-[#263238] mt-4 text-xl sm:text-2xl">
                  Login
                </h3>

                <p className="text-slate-500 mt-2 text-base sm:text-lg">
                  Verify admin details
                </p>
              </div>

              <div className="bg-[#F7F6EF] rounded-3xl p-6 sm:p-8 text-center border border-[#CDB52B]/25">
                <div className="text-4xl sm:text-5xl">📊</div>

                <h3 className="font-extrabold text-[#263238] mt-4 text-xl sm:text-2xl">
                  Access
                </h3>

                <p className="text-slate-500 mt-2 text-base sm:text-lg">
                  Manage CRM
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminEntry;