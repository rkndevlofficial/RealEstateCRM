import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";
import companyInfo from "../data/companyInfo";

function AdminProfile() {
  const [adminUser, setAdminUser] = useState({
    name: "Admin",
    email: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const storedAdmin = localStorage.getItem("adminUser");

        if (storedAdmin) {
          const parsedAdmin = JSON.parse(storedAdmin);

          setAdminUser({
            name: parsedAdmin.name || "Admin",
            email: parsedAdmin.email || "",
            role: parsedAdmin.role || "admin",
          });
        }

        const res = await API.get("/auth/me");

        const user = res.data?.user;

        if (user) {
          setAdminUser({
            name: user.name || "Admin",
            email: user.email || "",
            role: user.role || "admin",
          });

          localStorage.setItem("adminUser", JSON.stringify(user));
        }
      } catch (error) {
        console.log("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handlePasswordChange = (e) => {
    setFormError("");
    setFormSuccess("");

    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword.trim()) {
      return "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      return "New password is required";
    }

    if (passwordData.newPassword.length < 8) {
      return "New password must be at least 8 characters";
    }

    if (!/[a-z]/.test(passwordData.newPassword)) {
      return "New password must include at least one lowercase letter";
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      return "New password must include at least one uppercase letter";
    }

    if (!/\d/.test(passwordData.newPassword)) {
      return "New password must include at least one number";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      return "New password must be different from current password";
    }

    if (!passwordData.confirmPassword.trim()) {
      return "Confirm password is required";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return "New password and confirm password do not match";
    }

    return null;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePasswordForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      await API.put("/auth/change-password", passwordData);

      setFormSuccess("Password changed successfully. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("adminUser");
      localStorage.setItem(
        "adminSessionMessage",
        "Password changed successfully. Please login with your new password."
      );

      setTimeout(() => {
        window.location.replace("/admin");
      }, 1200);
    } catch (error) {
      console.log("Change password error:", error.response?.data || error);

      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const passwordInput = (label, name, placeholder) => {
    return (
      <div>
        <label className="block text-sm font-bold text-[#263238] mb-2">
          {label}
        </label>

        <div className="relative">
          <input
            type={showPassword[name] ? "text" : "password"}
            name={name}
            value={passwordData[name]}
            onChange={handlePasswordChange}
            placeholder={placeholder}
            className="w-full border border-slate-200 p-3.5 pr-16 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
            required
          />

          <button
            type="button"
            onClick={() => togglePassword(name)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35434A] font-bold text-sm"
          >
            {showPassword[name] ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    );
  };

  const profileCards = [
    {
      title: "Account Role",
      value: adminUser.role || "admin",
      icon: "🛡️",
      description: "Admin access enabled",
    },
    {
      title: "Authentication",
      value: "Protected",
      icon: "🔐",
      description: "JWT session verification active",
    },
    {
      title: "Auto Logout",
      value: "20 min",
      icon: "⏱️",
      description: "Inactive session protection",
    },
  ];

  return (
    <AdminLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm">
            Admin Settings
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#263238] mt-2">
            Profile & Security
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">
            View admin account details and update your password securely.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-linear-to-r from-[#35434A] to-[#263238] px-6 py-8 text-center text-white">
                <div className="bg-white rounded-3xl px-5 py-4 shadow-xl border border-white/30 w-fit mx-auto">
                  <img
                    src={companyInfo.logo || "/aranyak-logo.png"}
                    alt={companyInfo.name || "Aranyak Ventures"}
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                </div>

                <h2 className="text-2xl font-extrabold mt-5">
                  {loading ? "Loading..." : adminUser.name}
                </h2>

                <p className="text-white/60 mt-1 wrap-break-word">
                  {adminUser.email || "Admin email"}
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-[#F7F6EF] rounded-2xl p-4 border border-[#CDB52B]/20">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                      Company
                    </p>

                    <p className="text-[#263238] font-extrabold mt-1">
                      {companyInfo.name || "Aranyak Ventures"}
                    </p>
                  </div>

                  <div className="bg-[#F7F6EF] rounded-2xl p-4 border border-[#CDB52B]/20">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                      CRM App
                    </p>

                    <p className="text-[#263238] font-extrabold mt-1">
                      Admin CRM
                    </p>
                  </div>

                  <div className="bg-[#F7F6EF] rounded-2xl p-4 border border-[#CDB52B]/20">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                      Role
                    </p>

                    <p className="text-[#263238] font-extrabold mt-1 capitalize">
                      {adminUser.role || "admin"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/admin"
                  className="block mt-6 bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] text-white text-center px-6 py-3.5 rounded-xl font-extrabold transition shadow-lg"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-3 gap-5">
              {profileCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-3xl">
                    {card.icon}
                  </div>

                  <p className="text-slate-500 text-sm mt-5">{card.title}</p>

                  <h3 className="text-2xl font-extrabold text-[#263238] mt-1 capitalize">
                    {card.value}
                  </h3>

                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="bg-[#35434A] text-white px-6 sm:px-8 py-6">
                <h2 className="text-2xl font-extrabold">
                  Reset Admin Password
                </h2>

                <p className="text-white/60 mt-2">
                  Change your password from profile. After changing password,
                  you will be logged out automatically.
                </p>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="p-5 sm:p-8 space-y-5"
              >
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
                    {formError}
                  </div>
                )}

                {formSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
                    {formSuccess}
                  </div>
                )}

                {passwordInput(
                  "Current Password",
                  "currentPassword",
                  "Enter current password"
                )}

                {passwordInput(
                  "New Password",
                  "newPassword",
                  "Enter new password"
                )}

                {passwordInput(
                  "Confirm New Password",
                  "confirmPassword",
                  "Re-enter new password"
                )}

                <div className="bg-[#F7F6EF] border border-[#CDB52B]/20 rounded-2xl p-4">
                  <p className="font-extrabold text-[#263238] mb-2">
                    Password Rules:
                  </p>

                  <ul className="text-slate-600 text-sm space-y-1">
                    <li>✅ Minimum 8 characters</li>
                    <li>✅ At least one uppercase letter</li>
                    <li>✅ At least one lowercase letter</li>
                    <li>✅ At least one number</li>
                    <li>✅ Must be different from current password</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-extrabold transition shadow-lg"
                >
                  {submitting ? "Updating Password..." : "Reset Password"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#263238]">
                Quick Actions
              </h2>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/admin"
                  className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-6 py-3 rounded-xl font-extrabold text-center transition"
                >
                  Go to Dashboard
                </Link>

                <Link
                  to="/admin/projects"
                  className="bg-[#35434A] hover:bg-[#263238] text-white px-6 py-3 rounded-xl font-extrabold text-center transition"
                >
                  Manage Projects
                </Link>

                <Link
                  to="/admin/leads"
                  className="border border-[#35434A] text-[#35434A] hover:bg-[#35434A] hover:text-white px-6 py-3 rounded-xl font-extrabold text-center transition"
                >
                  View Leads
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminProfile;