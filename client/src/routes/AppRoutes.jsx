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

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/investment" element={<Investment />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsConditions />} />

      {/* Admin Entry */}
      <Route path="/admin" element={<AdminEntry />} />

      {/* Direct login URL disabled */}
      <Route path="/admin/login" element={<Navigate to="/admin" replace />} />

      {/* Protected Admin Routes */}
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
        element={<Navigate to="/admin/profile" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;