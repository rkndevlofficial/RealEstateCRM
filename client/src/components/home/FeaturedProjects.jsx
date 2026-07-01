import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectCard from "../projects/ProjectCard";
import API from "../../config/api";
import companyInfo from "../../data/companyInfo";

function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get("/projects");

      const projectsData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProjects(projectsData);
    } catch (error) {
      console.log("Featured projects error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();

    return (
      project.name?.toLowerCase().includes(searchText) ||
      project.location?.toLowerCase().includes(searchText)
    );
  });

  const visibleProjects = filteredProjects.slice(0, 6);

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-linear-to-b from-[#F7F6EF] via-white to-[#F7F6EF] overflow-hidden">
      {/* Background Design */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#9CA83A]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <p className="text-[#9CA83A] font-extrabold mb-3 tracking-[0.22em] uppercase text-xs sm:text-sm">
            Premium Listings
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#263238] leading-tight">
            Featured Properties
          </h2>

          <p className="text-slate-500 mt-4 text-base sm:text-lg leading-relaxed">
            Browse handpicked real estate projects with verified details,
            premium locations, and easy inquiry options from{" "}
            {companyInfo.name || "Aranyak Ventures"}.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by project name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 shadow-lg pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] text-[#263238]"
            />
          </div>

          {search && (
            <p className="text-center text-sm text-slate-500 mt-3">
              Showing {filteredProjects.length} result
              {filteredProjects.length !== 1 ? "s" : ""} for "{search}"
            </p>
          )}
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl p-5 shadow border border-slate-100 animate-pulse"
              >
                <div className="h-56 bg-slate-200 rounded-2xl"></div>
                <div className="h-5 bg-slate-200 rounded mt-5 w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded mt-3 w-full"></div>
                <div className="h-4 bg-slate-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : visibleProjects.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 70, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.75,
                    ease: "easeOut",
                    delay: Math.min(index * 0.08, 0.25),
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="text-center mt-12"
            >
              <Link
                to="/projects"
                className="inline-flex items-center justify-center bg-[#35434A] hover:bg-[#263238] text-white px-7 py-4 rounded-full font-extrabold transition shadow-xl"
              >
                View All Projects
              </Link>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-slate-100 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F7F6EF] flex items-center justify-center text-3xl mb-5">
              🏠
            </div>

            <h3 className="text-2xl font-extrabold text-[#263238]">
              No Projects Found
            </h3>

            <p className="text-slate-500 mt-2">
              Try searching with another project name or location.
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-6 py-3 rounded-full font-bold transition"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;