import { useState } from "react";
import API from "../config/api";
import AdminLayout from "../components/layout/AdminLayout";

function AdminChangePassword() {
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormError("");
    setFormSuccess("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      return "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      return "New password is required";
    }

    if (formData.newPassword.length < 8) {
      return "New password must be at least 8 characters";
    }

    if (!/[a-z]/.test(formData.newPassword)) {
      return "New password must include at least one lowercase letter";
    }

    if (!/[A-Z]/.test(formData.newPassword)) {
      return "New password must include at least one uppercase letter";
    }

    if (!/\d/.test(formData.newPassword)) {
      return "New password must include at least one number";
    }

    if (formData.currentPassword === formData.newPassword) {
      return "New password must be different from current password";
    }

    if (!formData.confirmPassword.trim()) {
      return "Confirm password is required";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return "New password and confirm password do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      await API.put("/auth/change-password", formData);

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
            value={formData[name]}
            onChange={handleChange}
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

  return (
    <AdminLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm">
            Security Settings
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#263238] mt-2">
            Change Password
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl leading-relaxed">
            Update your admin password regularly to keep the CRM secure.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-[#35434A] text-white px-5 sm:px-8 py-6">
            <h2 className="text-2xl font-extrabold">Admin Password</h2>

            <p className="text-white/60 mt-2">
              After changing password, you will be logged out automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
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
              {submitting ? "Updating Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminChangePassword;