import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";

function AdminActivityLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const moduleOptions = ["All", "Project", "Lead", "Auth", "Admin"];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
      };

      if (moduleFilter !== "All") {
        params.module = moduleFilter;
      }

      const res = await API.get("/activities", {
        params,
      });

      setLogs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.log("Activity logs error:", error.response?.data || error);

      setError(
        error.response?.data?.message ||
          "Unable to load activity logs. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getActivityIcon = (action) => {
    if (action?.includes("PROJECT")) return "🏠";
    if (action?.includes("LEAD")) return "📞";
    if (action?.includes("LOGIN")) return "🔐";
    if (action?.includes("PASSWORD")) return "🔑";
    return "📋";
  };

  const getActivityLabel = (action) => {
    if (!action) return "Activity";

    return action
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <AdminLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-white border border-slate-200 hover:border-[#CDB52B] text-[#263238] px-5 py-3 rounded-xl font-extrabold transition shadow-sm"
          >
            ← Back
          </button>

          <Link
            to="/admin"
            className="w-full sm:w-auto bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] text-white px-5 py-3 rounded-xl font-extrabold transition shadow-sm text-center"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm">
              Admin Audit Trail
            </p>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#263238] mt-2">
              Activity Logs
            </h1>

            <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">
              Track project changes, lead updates, login activity, and password
              changes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-white border border-slate-200 px-4 py-3 rounded-xl font-bold text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#CDB52B]"
            >
              {moduleOptions.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Modules" : item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fetchLogs}
              className="bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] text-white px-6 py-3 rounded-xl font-extrabold transition shadow-lg"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-5 gap-4 mb-8">
          {moduleOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setModuleFilter(item)}
              className={`rounded-2xl p-4 text-left border transition ${
                moduleFilter === item
                  ? "bg-[#35434A] text-white border-[#35434A]"
                  : "bg-white text-[#263238] border-slate-100 hover:border-[#CDB52B]"
              }`}
            >
              <p className="text-2xl">
                {item === "All"
                  ? "📋"
                  : item === "Project"
                  ? "🏠"
                  : item === "Lead"
                  ? "📞"
                  : item === "Auth"
                  ? "🔐"
                  : "⚙️"}
              </p>

              <p className="font-extrabold mt-2">{item}</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl font-semibold mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-[#35434A] text-white px-5 sm:px-8 py-6">
            <h2 className="text-2xl font-extrabold">Recent Activities</h2>

            <p className="text-white/60 mt-1">
              Showing latest {logs.length} records
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#35434A] text-[#CDB52B] flex items-center justify-center text-2xl animate-pulse">
                📋
              </div>

              <p className="text-slate-500 font-semibold mt-4">
                Loading activity logs...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl">📭</div>

              <h3 className="text-2xl font-extrabold text-[#263238] mt-4">
                No activity found
              </h3>

              <p className="text-slate-500 mt-2">
                Add/update/delete a project or change lead status. Logs will
                appear here automatically.
              </p>

              <Link
                to="/admin"
                className="inline-block mt-6 bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] text-white px-6 py-3 rounded-xl font-extrabold transition"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div
                  key={log._id || `${log.action}-${log.createdAt}`}
                  className="p-5 sm:p-6 hover:bg-[#F7F6EF]/60 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-2xl shrink-0">
                        {getActivityIcon(log.action)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center border px-3 py-1 rounded-full text-xs font-extrabold bg-slate-50 text-slate-700 border-slate-200">
                            {getActivityLabel(log.action)}
                          </span>

                          <span className="inline-flex items-center bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                            {log.module || "Activity"}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-[#263238] mt-3">
                          {log.message || "Activity recorded"}
                        </h3>

                        {log.targetName && (
                          <p className="text-slate-500 mt-1">
                            Target:{" "}
                            <span className="font-bold">
                              {log.targetName}
                            </span>
                          </p>
                        )}

                        <p className="text-slate-400 text-sm mt-2">
                          By {log.adminName || "System"}
                          {log.adminEmail ? ` • ${log.adminEmail}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="lg:text-right text-sm text-slate-500 font-semibold">
                      {formatDate(log.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminActivityLogs;