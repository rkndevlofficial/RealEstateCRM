import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";
import { isValidEmail } from "../utils/validators";
import companyInfo from "../data/companyInfo";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);

      const response = await API.post(
        "/auth/forgot-password",
        {
          email: normalizedEmail,
        }
      );

      setSuccess(
        response.data?.message ||
          "If an admin account exists with this email, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      console.log(
        "Forgot password error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again."
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
              🔐
            </div>
          )}

          <p className="text-[#9CA83A] font-extrabold tracking-[0.2em] uppercase text-xs mb-2">
            Account Recovery
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263238]">
            Forgot Password?
          </h1>

          <p className="text-slate-500 mt-2 leading-relaxed">
            Enter your admin email and we will send you
            a secure password reset link.
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
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-bold text-[#263238] mb-2">
            Admin Email
          </label>

          <input
            type="email"
            placeholder="Enter your admin email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccess("");
            }}
            autoComplete="email"
            className="w-full border border-slate-200 p-3.5 rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-extrabold transition shadow-lg"
          >
            {submitting
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}

        <div className="mt-6 text-center">
          <Link
            to="/admin"
            className="text-sm font-bold text-[#35434A] hover:text-[#9CA83A] transition"
          >
            ← Back to Admin Login
          </Link>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          For security, we do not reveal whether an
          admin email exists in the system.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;