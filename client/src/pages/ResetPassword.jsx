import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../config/api";
import companyInfo from "../data/companyInfo";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = () => {
    const password = formData.newPassword;

    if (!password) {
      return "New password is required";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain a lowercase letter";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain an uppercase letter";
    }

    if (!/\d/.test(password)) {
      return "Password must contain a number";
    }

    if (!formData.confirmPassword) {
      return "Confirm password is required";
    }

    if (
      password !== formData.confirmPassword
    ) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid password reset link."
      );
      return;
    }

    const validationError = validatePassword();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post(
        `/auth/reset-password/${token}`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }
      );

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      /*
       Redirect to login after a short delay.
      */

      setTimeout(() => {
        navigate("/admin", {
          replace: true,
        });
      }, 2500);
    } catch (error) {
      console.log(
        "Reset password error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to reset password. The link may have expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#263238] via-[#35434A] to-[#1f2933] flex items-center justify-center px-4 py-8">

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md">

        {/* Logo */}

        <div className="text-center mb-8">
          {companyInfo.logo ? (
            <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-100 w-fit mx-auto mb-5">
              <img
                src={companyInfo.logo}
                alt={
                  companyInfo.name ||
                  "Aranyak Ventures"
                }
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#35434A] text-[#CDB52B] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🔑
            </div>
          )}

          <p className="text-[#9CA83A] font-extrabold tracking-[0.2em] uppercase text-xs mb-2">
            Account Recovery
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263238]">
            Reset Password
          </h1>

          <p className="text-slate-500 mt-2 leading-relaxed">
            Create a new secure password for your
            admin account.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
            {success}
            <div className="mt-2 text-sm font-medium">
              Redirecting to login...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* New Password */}

          <label className="block text-sm font-bold text-[#263238] mb-2">
            New Password
          </label>

          <div className="relative mb-4">
            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full border border-slate-200 p-3.5 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35434A] font-bold text-sm"
            >
              {showNewPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {/* Password Requirements */}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5">
            <p className="text-xs font-bold text-[#263238] mb-2">
              Password must contain:
            </p>

            <ul className="text-xs text-slate-500 space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>

          {/* Confirm Password */}

          <label className="block text-sm font-bold text-[#263238] mb-2">
            Confirm New Password
          </label>

          <div className="relative mb-6">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full border border-slate-200 p-3.5 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35434A] font-bold text-sm"
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting || Boolean(success)}
            className="w-full bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-extrabold transition shadow-lg"
          >
            {submitting
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>

        {/* Login */}

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="text-sm font-bold text-[#35434A] hover:text-[#9CA83A] transition"
          >
            ← Back to Admin Login
          </Link>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          Password reset links are valid for 15 minutes.
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;