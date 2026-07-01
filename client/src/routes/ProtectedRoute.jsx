import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../config/api";

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInstalledApp, setIsInstalledApp] = useState(false);

  const checkIsInstalledApp = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const installed = checkIsInstalledApp();

        setIsInstalledApp(installed);

        if (!installed) {
          setIsAuthorized(false);
          setChecking(false);
          return;
        }

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

    verifyAdmin();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F6EF] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8 text-center max-w-sm w-full">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#35434A] text-[#CDB52B] flex items-center justify-center text-2xl animate-pulse">
            🔐
          </div>

          <h2 className="text-xl font-extrabold text-[#263238] mt-5">
            Checking Admin Access
          </h2>

          <p className="text-slate-500 mt-2">
            Please wait while we verify your admin app.
          </p>
        </div>
      </div>
    );
  }

  if (!isInstalledApp) {
    return <Navigate to="/admin" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;