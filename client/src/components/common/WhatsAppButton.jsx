import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import API from "../../config/api";
import companyInfo from "../../data/companyInfo";

function WhatsAppButton() {
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState(null);

  const whatsappNumber = String(
    companyInfo.whatsapp || companyInfo.phone || "918127819848"
  ).replace(/\D/g, "");

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const pathname = location.pathname;

  useEffect(() => {
    const fetchCurrentProject = async () => {
      const pathParts = pathname.split("/").filter(Boolean);

      const isProjectDetailsPage =
        pathParts[0] === "projects" && pathParts[1];

      if (!isProjectDetailsPage) {
        setCurrentProject(null);
        return;
      }

      try {
        const projectId = pathParts[1];
        const res = await API.get(`/projects/${projectId}`);

        const projectData = res.data?.data || res.data;

        setCurrentProject(projectData);
      } catch (error) {
        console.log("WhatsApp project fetch error:", error);
        setCurrentProject(null);
      }
    };

    fetchCurrentProject();
  }, [pathname]);

  const formatPrice = (price) => {
    const amount = Number(price || 0);

    if (!amount) return "Price on Request";

    if (amount >= 10000000) {
      const value = amount / 10000000;
      return `₹ ${value.toFixed(value % 1 === 0 ? 0 : 2)} Cr`;
    }

    if (amount >= 100000) {
      const value = amount / 100000;
      return `₹ ${value.toFixed(value % 1 === 0 ? 0 : 2)} Lakh`;
    }

    return `₹ ${amount.toLocaleString("en-IN")}`;
  };

  const getPageMessage = () => {
    const companyName = companyInfo.name || "Aranyak Ventures";

    if (pathname === "/") {
      return `Hello ${companyName}, I visited your website and I am interested in your property projects. Please share more details.`;
    }

    if (pathname === "/projects") {
      return `Hello ${companyName}, I am checking your Projects page. Please share available and upcoming property options with pricing and site visit details.\n\nPage: ${currentUrl}`;
    }

    if (pathname.startsWith("/projects/")) {
      if (currentProject?.name) {
        const unitTypes =
          currentProject.unitTypes?.length > 0
            ? currentProject.unitTypes.map((unit) => unit.type).join(", ")
            : "Configurations available";

        return `Hello ${companyName}, I am interested in this project.\n\nProject: ${
          currentProject.name
        }\nLocation: ${
          currentProject.location || "Location not mentioned"
        }\nStarting Price: ${formatPrice(
          currentProject.price
        )}\nStatus: ${
          currentProject.status || "Available"
        }\nUnit Types: ${unitTypes}\n\nPage: ${currentUrl}\n\nPlease share more details and site visit availability.`;
      }

      return `Hello ${companyName}, I am interested in the project shown on this page.\n\nPage: ${currentUrl}\n\nPlease share more details and site visit availability.`;
    }

    if (pathname === "/about") {
      return `Hello ${companyName}, I visited your About page and would like to know more about your real estate projects and services.\n\nPage: ${currentUrl}`;
    }

    if (pathname === "/contact") {
      return `Hello ${companyName}, I visited your Contact page and would like to connect with your team regarding property options.\n\nPage: ${currentUrl}`;
    }

    return `Hello ${companyName}, I am interested in your property projects. Please share more details.\n\nPage: ${currentUrl}`;
  };

  const message = encodeURIComponent(getPageMessage());

  return (
    <motion.a
      whileHover={{
        scale: 1.08,
        y: -4,
      }}
      whileTap={{
        scale: 0.95,
      }}
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl bg-[#9CA83A] hover:bg-[#CDB52B] text-white hover:text-[#263238] border border-white/20 transition"
    >
      💬
    </motion.a>
  );
}

export default WhatsAppButton;