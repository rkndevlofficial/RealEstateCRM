import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ProjectCard({ project }) {
  const unitTypesText =
    project?.unitTypes?.length > 0
      ? project.unitTypes.map((unit) => unit.type).join(", ")
      : "Configurations Available";

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

  const getStatusClass = (status) => {
    if (status === "Available") {
      return "bg-[#9CA83A] text-white";
    }

    if (status === "Upcoming") {
      return "bg-[#CDB52B] text-[#263238]";
    }

    if (status === "Sold") {
      return "bg-red-600 text-white";
    }

    return "bg-[#35434A] text-white";
  };

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.015,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="group relative h-full overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500"
    >
      {/* Glow Border */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-linear-to-br from-[#CDB52B]/25 via-transparent to-[#9CA83A]/25"></div>

      {/* Shine Effect */}
      <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none overflow-hidden">
        <div className="absolute -left-24 top-0 h-full w-20 bg-white/35 rotate-12 group-hover:translate-x-130 transition-transform duration-1000"></div>
      </div>

      {/* Image */}
      <div className="relative h-52 sm:h-60 md:h-64 overflow-hidden">
        <img
          src={project?.image || "https://placehold.co/700x500?text=Property"}
          alt={project?.name || "Property"}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#263238]/95 via-[#263238]/35 to-transparent"></div>

        {/* Status */}
        <span
          className={`absolute top-4 right-4 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold shadow-lg ${getStatusClass(
            project?.status
          )}`}
        >
          {project?.status || "Available"}
        </span>

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center bg-white/95 backdrop-blur-md text-[#263238] px-4 py-2 rounded-full text-sm font-extrabold shadow-lg border border-white/50">
            {formatPrice(project?.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#263238] group-hover:text-[#9CA83A] transition leading-tight line-clamp-2">
            {project?.name || "Property Name"}
          </h3>

          <p className="text-slate-500 mt-2 text-sm sm:text-base line-clamp-1">
            📍 {project?.location || "Location"}
          </p>
        </div>

        {project?.description && (
          <p className="text-slate-500 mt-4 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Details Chips */}
        <div className="flex flex-wrap gap-2 mt-5 text-xs">
          {project?.floors > 0 && (
            <span className="bg-[#F7F6EF] text-[#35434A] px-3 py-1.5 rounded-full font-bold border border-[#CDB52B]/20">
              🏢 {project.floors} Floors
            </span>
          )}

          {project?.unitTypes?.length > 0 && (
            <span className="bg-[#CDB52B]/10 text-[#7A6A0A] px-3 py-1.5 rounded-full font-bold border border-[#CDB52B]/20">
              🏠 {unitTypesText}
            </span>
          )}

          {project?.images?.length > 0 && (
            <span className="bg-[#9CA83A]/10 text-[#5F6B20] px-3 py-1.5 rounded-full font-bold border border-[#9CA83A]/20">
              🖼️ {project.images.length} Photos
            </span>
          )}

          {project?.brochure && (
            <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-bold border border-red-100">
              📄 Brochure
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/projects/${project?._id}`}
          className="mt-6 flex items-center justify-center gap-2 w-full bg-[#35434A] hover:bg-[#CDB52B] text-white hover:text-[#263238] py-3.5 rounded-2xl text-center font-extrabold transition-all duration-300 shadow-lg shadow-slate-950/10"
        >
          View Details
          <span className="group-hover:translate-x-1 transition">→</span>
        </Link>
      </div>
    </motion.div>
  );
}

export default ProjectCard;