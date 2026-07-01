import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import companyInfo from "../data/companyInfo";

function About() {
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 600], [1.05, 1.17]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -75]);
  const heroTextOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  const stats = [
    {
      number: companyInfo.stats?.[3]?.number || "10+",
      label: companyInfo.stats?.[3]?.label || "Years Experience",
    },
    {
      number: companyInfo.stats?.[2]?.number || "300+",
      label: companyInfo.stats?.[2]?.label || "Happy Families",
    },
    {
      number: companyInfo.stats?.[1]?.number || "500+",
      label: companyInfo.stats?.[1]?.label || "Properties",
    },
    {
      number: "24/7",
      label: "Customer Support",
    },
  ];

  const aboutParagraphs = [
    `${companyInfo.name || "Aranyak Ventures"} is built on the belief that real estate is not just about buying property, but about creating a better future on the same ground. We focus on helping families and investors discover trusted real estate opportunities with clarity, quality, and confidence.`,

    "Our approach is simple: transparent communication, verified project information, and professional guidance at every step. From property discovery to site visits and final decision-making, our team works to make the process smooth and reliable.",

    "We understand that every customer has different goals. Some are looking for a dream home, some are planning a long-term investment, and some want a property in a growing location. Our role is to guide them with genuine details and practical support.",

    "With a future-focused vision, we continue to build trust through premium projects, responsive service, and a customer-first experience. Every interaction is handled with professionalism, honesty, and long-term relationship value.",
  ];

  const whyChooseUs = [
    {
      icon: "🏠",
      title: "Verified Properties",
      desc: "We provide carefully reviewed property details so customers can make informed and confident decisions.",
    },
    {
      icon: "🤝",
      title: "Trusted Guidance",
      desc: "Our team supports customers from inquiry to site visit with clear communication and professional assistance.",
    },
    {
      icon: "📈",
      title: "Future-Focused Value",
      desc: "We help customers explore locations and projects that are designed for better lifestyle and long-term growth.",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Our Mission",
      desc: "To make real estate discovery more transparent, reliable, and customer-friendly.",
    },
    {
      icon: "👁️",
      title: "Our Vision",
      desc: "To become a trusted real estate brand known for quality projects and future-focused development.",
    },
    {
      icon: "🌿",
      title: "Our Promise",
      desc: "To deliver honest guidance, verified information, and a smooth property experience.",
    },
  ];

  const reveal = {
    hidden: {
      opacity: 0,
      y: 55,
      scale: 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const leftReveal = {
    hidden: {
      opacity: 0,
      x: -55,
    },
    show: {
      opacity: 1,
      x: 0,
    },
  };

  const rightReveal = {
    hidden: {
      opacity: 0,
      x: 55,
    },
    show: {
      opacity: 1,
      x: 0,
    },
  };

  const revealViewport = {
    once: false,
    amount: 0.2,
  };

  return (
    <div className="bg-[#F7F6EF] min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[78svh] md:min-h-[88vh] bg-[#35434A] text-white overflow-hidden flex items-center">
        <motion.div
          style={{
            y: heroY,
            scale: heroScale,
          }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c')] bg-cover bg-center opacity-45"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#263238] via-[#35434A]/90 to-[#35434A]/40"></div>
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(205,181,43,0.22),transparent_34%),radial-gradient(circle_at_82%_75%,rgba(156,168,58,0.18),transparent_38%)]"></div>

        <motion.div
          style={{
            y: heroTextY,
            opacity: heroTextOpacity,
          }}
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur-xl rounded-full px-4 py-2 mb-5">
            <span className="w-2.5 h-2.5 bg-[#CDB52B] rounded-full"></span>

            <p className="text-[#CDB52B] font-extrabold uppercase tracking-[0.22em] text-xs sm:text-sm">
              About Us
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2 leading-tight">
            Building Trust Through Real Estate
          </h1>

          <p className="text-white/75 max-w-3xl mx-auto mt-5 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed">
            {companyInfo.shortDescription ||
              "We help families and investors discover trusted real estate opportunities with transparency, quality, and a future-focused vision."}
          </p>

          <p className="text-[#CDB52B] mt-5 font-semibold tracking-wide">
            {companyInfo.tagline || "Same Ground, Different Future"}
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Who We Are */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={leftReveal}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            <p className="text-[#9CA83A] font-extrabold mb-3 tracking-[0.22em] uppercase text-xs sm:text-sm">
              Who We Are
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#263238] leading-tight">
              Premium Property Experience With Future-Focused Vision
            </h2>

            <div className="mt-5 space-y-4">
              {aboutParagraphs.map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(index * 0.08, 0.25),
                  }}
                  className="text-slate-600 leading-relaxed text-base sm:text-lg"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.04, y: -2 }}>
                <Link
                  to="/projects"
                  className="flex items-center justify-center bg-[#35434A] text-white px-7 py-3 rounded-full font-extrabold hover:bg-[#CDB52B] hover:text-[#263238] transition"
                >
                  View Projects
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04, y: -2 }}>
                <Link
                  to="/contact"
                  className="flex items-center justify-center border border-[#35434A] text-[#35434A] px-7 py-3 rounded-full font-extrabold hover:bg-[#35434A] hover:text-white transition"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={rightReveal}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {companyInfo.logo && (
                <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-100 w-fit mb-6">
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name || "Aranyak Ventures"}
                    className="h-16 sm:h-20 w-auto object-contain"
                  />
                </div>
              )}

              <p className="text-[#CDB52B] font-bold tracking-wide">
                {companyInfo.tagline || "Same Ground, Different Future"}
              </p>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#263238] mt-3">
                {companyInfo.name || "Aranyak Ventures"}
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                A trusted real estate partner focused on premium projects,
                transparent communication, and customer-first property support.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-5 mt-8">
                {stats.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 35, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.06,
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-[#F7F6EF] rounded-2xl p-4 sm:p-5 text-center border border-[#CDB52B]/15"
                  >
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-[#9CA83A]">
                      {item.number}
                    </h3>

                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Why Choose Us */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          transition={{ staggerChildren: 0.1 }}
          className="mt-16 sm:mt-20"
        >
          <motion.div
            variants={reveal}
            transition={{ duration: 0.65 }}
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-12"
          >
            <p className="text-[#9CA83A] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
              Our Strength
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#263238] leading-tight">
              Why Choose Us
            </h2>

            <p className="text-slate-500 mt-4 text-base sm:text-lg leading-relaxed">
              We combine trusted real estate guidance, verified information, and
              professional customer support to make your property journey easier.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                variants={reveal}
                transition={{
                  duration: 0.65,
                  delay: Math.min(index * 0.08, 0.2),
                }}
                whileHover={{ y: -8, scale: 1.015 }}
                className="bg-white p-5 sm:p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-[#CDB52B]/10 to-[#9CA83A]/10"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-4xl mb-5">
                    {item.icon}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 mt-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Vision Promise */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          transition={{ staggerChildren: 0.1 }}
          className="mt-16 sm:mt-20 grid md:grid-cols-3 gap-5 sm:gap-6"
        >
          {values.map((item, index) => (
            <motion.div
              key={index}
              variants={reveal}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.08, 0.2),
              }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="bg-linear-to-br from-[#35434A] to-[#263238] text-white p-5 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-4xl mb-4">{item.icon}</div>

                <h3 className="text-xl sm:text-2xl font-extrabold">
                  {item.title}
                </h3>

                <p className="text-white/65 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 55, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mt-16 sm:mt-20 bg-linear-to-r from-[#35434A] to-[#263238] rounded-3xl p-6 sm:p-10 text-center text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-24 left-10 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 right-10 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-[#CDB52B] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
              Start Your Journey
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Looking For The Right Property?
            </h2>

            <p className="text-white/65 mt-3 max-w-2xl mx-auto leading-relaxed">
              Explore premium projects or connect with our team for personalized
              real estate guidance.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.04, y: -2 }}>
                <Link
                  to="/projects"
                  className="flex items-center justify-center bg-[#CDB52B] text-[#263238] px-7 py-3 rounded-full font-extrabold hover:bg-[#9CA83A] transition"
                >
                  Explore Projects
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04, y: -2 }}>
                <Link
                  to="/contact"
                  className="flex items-center justify-center border border-[#CDB52B] text-[#CDB52B] px-7 py-3 rounded-full font-extrabold hover:bg-[#CDB52B] hover:text-[#263238] transition"
                >
                  Contact Team
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default About;