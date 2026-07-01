import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import API from "../../config/api";
import companyInfo from "../../data/companyInfo";

function HeroSection() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { scrollY } = useScroll();

  const imageY = useTransform(scrollY, [0, 1000], [0, 220]);
  const imageScale = useTransform(scrollY, [0, 700], [1.05, 1.18]);
  const contentY = useTransform(scrollY, [0, 600], [0, -120]);
  const contentOpacity = useTransform(scrollY, [0, 430], [1, 0]);

  const whatsappNumber = String(
    companyInfo.whatsapp || "919209774755"
  ).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello ${companyInfo.name || "Aranyak Ventures"}, I am interested in your property projects. Please share more details.`
  );

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      tag: companyInfo.name || "Aranyak Ventures",
      title: companyInfo.tagline || "Same Ground, Different Future",
      desc:
        companyInfo.shortDescription ||
        "Discover trusted real estate opportunities with transparency, quality, and a future-focused vision.",
    },
    {
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      tag: "Premium Living Spaces",
      title: "Homes Designed for Better Living",
      desc:
        "Explore premium residences, modern apartments, and investment-ready properties with reliable guidance.",
    },
    {
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      tag: "Future-Focused Investment",
      title: "Invest in Locations That Grow With You",
      desc:
        "Compare projects, view configurations, download brochures, calculate EMI, and schedule site visits easily.",
    },
  ];

  useEffect(() => {
    fetchProjectCount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroSlides.length - 1 ? 0 : prev + 1
      );
    }, 5500);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchProjectCount = async () => {
    try {
      const res = await API.get("/projects");

      const projects = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setTotalProjects(projects.length);
    } catch (error) {
      console.log("Project count error:", error);
    }
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative min-h-svh md:min-h-[115vh] flex items-center bg-[#35434A] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          style={{
            y: imageY,
            scale: imageScale,
          }}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 h-[112%]"
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-r from-[#263238] via-[#35434A]/90 to-[#35434A]/25"></div>
      <div className="absolute inset-0 bg-black/35"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(205,181,43,0.22),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(156,168,58,0.18),transparent_35%)]"></div>

      <motion.div
        style={{
          y: contentY,
          opacity: contentOpacity,
        }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur-xl rounded-full px-4 py-2 mb-5">
              <span className="w-2.5 h-2.5 bg-[#CDB52B] rounded-full"></span>

              <p className="text-[#CDB52B] font-bold text-xs sm:text-sm tracking-[0.22em] uppercase">
                {activeSlide.tag}
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.08] max-w-5xl">
              {activeSlide.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/75 mt-5 sm:mt-6 max-w-2xl leading-relaxed">
              {activeSlide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35 }}
          className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4"
        >
          <motion.div whileHover={{ scale: 1.04, y: -3 }} className="w-full sm:w-auto">
            <Link
              to="/projects"
              className="flex items-center justify-center w-full sm:w-auto bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-7 py-4 rounded-full font-extrabold transition shadow-xl"
            >
              View Projects
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -3 }} className="w-full sm:w-auto">
            <Link
              to="/contact"
              className="flex items-center justify-center w-full sm:w-auto border border-[#CDB52B] text-[#CDB52B] px-7 py-4 rounded-full font-extrabold hover:bg-[#CDB52B] hover:text-[#263238] transition"
            >
              Book Site Visit
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -3 }} className="w-full sm:w-auto">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-full sm:w-auto border border-[#9CA83A] text-[#9CA83A] px-7 py-4 rounded-full font-extrabold hover:bg-[#9CA83A] hover:text-white transition"
            >
              WhatsApp Enquiry
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.5 }}
          className="mt-10 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-5 max-w-xl"
        >
          {[
            { number: `${totalProjects}+`, label: "Projects" },
            {
              number: companyInfo.stats?.[1]?.number || "500+",
              label: companyInfo.stats?.[1]?.label || "Properties",
            },
            {
              number: companyInfo.stats?.[2]?.number || "300+",
              label: companyInfo.stats?.[2]?.label || "Happy Families",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/10"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#CDB52B]">
                {item.number}
              </h3>

              <p className="text-white/70 text-xs sm:text-sm mt-1">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-3 mt-8 sm:mt-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-10 bg-[#CDB52B]"
                  : "w-3 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;