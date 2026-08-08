import { Navigate, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import Investment from "../pages/Investment";
import ProjectDetails from "../pages/ProjectDetails";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";
import FAQ from "../pages/FAQ";

import AdminEntry from "../pages/AdminEntry";
import AdminProjects from "../pages/AdminProjects";
import LeadsPage from "../pages/LeadsPage";
import AdminProfile from "../pages/AdminProfile";
import AdminActivityLogs from "../pages/AdminActivityLogs";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC WEBSITE ROUTES
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/projects"
        element={<Projects />}
      />

      <Route
        path="/projects/:id"
        element={<ProjectDetails />}
      />

      <Route
        path="/investment"
        element={<Investment />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/faq"
        element={<FAQ />}
      />

      <Route
        path="/privacy-policy"
        element={<PrivacyPolicy />}
      />

      <Route
        path="/terms-and-conditions"
        element={<TermsConditions />}
      />

      {/* =========================
          ADMIN ENTRY / LOGIN
      ========================== */}

      <Route
        path="/admin"
        element={<AdminEntry />}
      />

      {/* Direct login URL disabled */}

      <Route
        path="/admin/login"
        element={
          <Navigate
            to="/admin"
            replace
          />
        }
      />

      {/* =========================
          FORGOT PASSWORD
      ========================== */}

      <Route
        path="/admin/forgot-password"
        element={<ForgotPassword />}
      />

      {/* =========================
          RESET PASSWORD
      ========================== */}

      <Route
        path="/admin/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* =========================
          PROTECTED ADMIN ROUTES
      ========================== */}

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <LeadsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/activity-logs"
        element={
          <ProtectedRoute>
            <AdminActivityLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/change-password"
        element={
          <Navigate
            to="/admin/profile"
            replace
          />
        }
      />

      {/* =========================
          FALLBACK
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;