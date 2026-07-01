import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import API from "../config/api";
import companyInfo from "../data/companyInfo";
import ProjectCard from "../components/projects/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { scrollY } = useScroll();

  const heroImageY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroContentY = useTransform(scrollY, [0, 700], [0, -70]);

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
      console.log("Fetch Error:", error);
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

  const stats = [
    [`${projects.length}+`, "Active Projects"],
    [
      companyInfo.stats?.[1]?.number || "500+",
      companyInfo.stats?.[1]?.label || "Properties",
    ],
    [
      companyInfo.stats?.[2]?.number || "300+",
      companyInfo.stats?.[2]?.label || "Happy Families",
    ],
    [
      companyInfo.stats?.[3]?.number || "10+",
      companyInfo.stats?.[3]?.label || "Years Experience",
    ],
  ];

  return (
    <div className="relative bg-[#F7F6EF] min-h-screen overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-40 -left-40 w-80 h-80 sm:w-96 sm:h-96 bg-[#CDB52B]/20 blur-[130px] rounded-full"></div>
      <div className="absolute top-212.5 -right-40 w-80 h-80 sm:w-96 sm:h-96 bg-[#9CA83A]/20 blur-[130px] rounded-full"></div>

      {/* Hero Section */}
      <section className="relative min-h-[82svh] md:min-h-screen overflow-hidden text-white flex items-center">
        <motion.div
          style={{ y: heroImageY }}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
            alt="Aranyak Ventures Projects"
            className="w-full h-[115%] object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-r from-[#263238] via-[#35434A]/90 to-[#35434A]/35"></div>
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(205,181,43,0.22),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(156,168,58,0.18),transparent_38%)]"></div>

        <motion.div
          style={{ y: heroContentY }}
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur-xl rounded-full px-4 py-2 mb-5">
            <span className="w-2.5 h-2.5 bg-[#CDB52B] rounded-full"></span>

            <p className="text-[#CDB52B] font-bold tracking-[0.22em] uppercase text-xs sm:text-sm">
              {companyInfo.name || "Aranyak Ventures"}
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2 leading-tight">
            Explore Our Projects
          </h1>

          <p className="text-white/75 max-w-3xl mx-auto mt-5 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed">
            Discover premium residential and commercial properties in prime
            locations with modern amenities, transparent details, and trusted
            real estate support.
          </p>

          <p className="mt-5 text-[#CDB52B] font-semibold tracking-wide">
            {companyInfo.tagline || "Same Ground, Different Future"}
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: false,
                amount: 0.2,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
                scale: 1.025,
              }}
              className="bg-white rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-[#CDB52B]/10 to-[#9CA83A]/10"></div>

              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#9CA83A]">
                  {item[0]}
                </h3>

                <p className="text-slate-500 mt-2 sm:mt-3 text-sm sm:text-base">
                  {item[1]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: false }}
          transition={{ duration: 0.65 }}
          className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 border border-slate-100"
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
              className="w-full border border-slate-200 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] text-[#263238]"
            />
          </div>

          {search && (
            <p className="text-center text-sm text-slate-500 mt-3">
              Showing {filteredProjects.length} result
              {filteredProjects.length !== 1 ? "s" : ""} for "{search}"
            </p>
          )}
        </motion.div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 45,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              duration: 0.75,
            }}
          >
            <p className="text-[#9CA83A] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
              Property Collection
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#263238]">
              Available Projects
            </h2>
          </motion.div>

          <span className="text-slate-500 bg-white border border-slate-100 shadow-sm px-5 py-3 rounded-full w-fit">
            {filteredProjects.length} Properties Found
          </span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl p-5 shadow border border-slate-100 animate-pulse"
              >
                <div className="h-56 bg-slate-200 rounded-2xl"></div>
                <div className="h-5 bg-slate-200 rounded mt-5 w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded mt-3 w-full"></div>
                <div className="h-4 bg-slate-200 rounded mt-2 w-1/2"></div>
                <div className="h-12 bg-slate-200 rounded-2xl mt-6"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65 }}
            className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center border border-slate-100 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F7F6EF] flex items-center justify-center text-3xl mb-5">
              🏠
            </div>

            <h2 className="text-2xl font-extrabold text-[#263238]">
              No Projects Found
            </h2>

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
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{
                  opacity: 0,
                  y: 70,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: false,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.75,
                  delay: Math.min(index * 0.08, 0.35),
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Projects;