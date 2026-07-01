import { useEffect, useState } from "react";
import API from "../config/api";
import { isValidEmail } from "../utils/validators";
import companyInfo from "../data/companyInfo";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const message = localStorage.getItem("adminSessionMessage");

    if (message) {
      setSessionMessage(message);
      localStorage.removeItem("adminSessionMessage");
    }
  }, []);

  const handleChange = (e) => {
    setFormError("");
    setSessionMessage("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateLoginForm = () => {
    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!isValidEmail(formData.email)) {
      return "Enter a valid email address";
    }

    if (!formData.password.trim()) {
      return "Password is required";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validateLoginForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setSessionMessage("");

      const res = await API.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (!res.data?.token) {
        setFormError("Login failed. Token not received.");
        return;
      }

      localStorage.setItem("token", res.data.token);

      if (res.data?.user) {
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));
      }

      localStorage.removeItem("adminSessionMessage");

      window.location.replace("/admin");
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);

      const message =
        error.response?.data?.message || "Invalid email or password ❌";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#35434A] px-4 py-10 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#CDB52B]/15 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#9CA83A]/15 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(205,181,43,0.16),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(156,168,58,0.14),transparent_35%)]"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30"
      >
        <div className="text-center mb-8">
          {companyInfo.logo ? (
            <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-100 w-fit mx-auto mb-5">
              <img
                src={companyInfo.logo}
                alt={companyInfo.name || "Aranyak Ventures"}
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-[#35434A] text-[#CDB52B] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🏠
            </div>
          )}

          <p className="text-[#9CA83A] font-extrabold tracking-[0.2em] uppercase text-xs mb-2">
            Secure Admin App
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263238]">
            Admin Login
          </h1>

          <p className="text-slate-500 mt-2">
            Login to manage projects and leads
          </p>
        </div>

        {sessionMessage && (
          <div className="mb-5 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl font-semibold">
            {sessionMessage}
          </div>
        )}

        {formError && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
            {formError}
          </div>
        )}

        <label className="block text-sm font-bold text-[#263238] mb-2">
          Email Address
        </label>

        <input
          type="email"
          name="email"
          placeholder="Enter admin email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className="w-full border border-slate-200 p-3.5 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
          required
        />

        <label className="block text-sm font-bold text-[#263238] mb-2">
          Password
        </label>

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full border border-slate-200 p-3.5 pr-14 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#35434A] font-bold text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-extrabold transition shadow-lg"
        >
          {submitting ? "Verifying..." : "Login"}
        </button>

        <div className="mt-5 text-center text-sm">
          <p className="text-slate-400">
            Private admin access only through installed admin app
          </p>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;