import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../config/api";
import companyInfo from "../../data/companyInfo";

function StatsSection() {
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    fetchProjectsCount();
  }, []);

  const fetchProjectsCount = async () => {
    try {
      const res = await API.get("/projects");

      const projects = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProjectCount(projects.length);
    } catch (error) {
      console.log("Project count error:", error);
    }
  };

  const stats = [
    {
      number: `${projectCount}+`,
      label: "Premium Projects",
      icon: "🏗️",
    },
    {
      number: companyInfo.stats?.[1]?.number || "500+",
      label: companyInfo.stats?.[1]?.label || "Properties",
      icon: "🏠",
    },
    {
      number: companyInfo.stats?.[2]?.number || "300+",
      label: companyInfo.stats?.[2]?.label || "Happy Families",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      number: companyInfo.stats?.[3]?.number || "10+",
      label: companyInfo.stats?.[3]?.label || "Years Experience",
      icon: "⭐",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 bg-[#35434A] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,181,43,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(156,168,58,0.14),transparent_38%)]"></div>

      <div className="absolute top-10 left-6 w-24 h-24 sm:w-36 sm:h-36 border border-[#CDB52B]/20 rounded-full"></div>
      <div className="absolute bottom-10 right-6 w-28 h-28 sm:w-44 sm:h-44 border border-[#9CA83A]/20 rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{ duration: 0.75 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <p className="text-[#CDB52B] font-bold mb-3 tracking-[0.22em] uppercase text-xs sm:text-sm">
            Why Choose Us
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Trusted Real Estate Partner
          </h2>

          <p className="text-white/65 mt-4 sm:mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Delivering premium properties, transparent deals, and a future-focused
            real estate experience with {companyInfo.name || "Aranyak Ventures"}.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.94,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: false,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group relative overflow-hidden bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 text-center shadow-xl"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-linear-to-br from-[#CDB52B]/15 via-[#9CA83A]/10 to-transparent"></div>

              <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#CDB52B]/10 rounded-full blur-2xl group-hover:bg-[#9CA83A]/20 transition"></div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.08,
                  }}
                  className="text-3xl sm:text-4xl lg:text-5xl mb-4"
                >
                  {item.icon}
                </motion.div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#CDB52B] leading-none">
                  {item.number}
                </h3>

                <p className="text-white/70 mt-3 text-xs sm:text-sm lg:text-base font-medium">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Small CTA */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 sm:mt-14 text-center"
        >
          <p className="inline-flex items-center justify-center bg-white/10 border border-white/10 text-white/75 px-5 py-3 rounded-full text-sm sm:text-base">
            {companyInfo.tagline || "Same Ground, Different Future"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default StatsSection;