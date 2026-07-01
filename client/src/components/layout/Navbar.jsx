import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import companyInfo from "../../data/companyInfo";

function Navbar() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const phoneNumber =
    companyInfo.phone?.replace(/[^\d+]/g, "") || "+912231864682";

  const whatsappNumber = String(
    companyInfo.whatsapp || "919209774755"
  ).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello ${
      companyInfo.name || "Aranyak Ventures"
    }, I am interested in your property projects. Please share more details.`
  );

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Investment", path: "/investment" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setScrolled(currentScroll > 40);

      if (currentScroll > lastScroll && currentScroll > 140) {
        setShowNavbar(false);
        setMenuOpen(false);
      } else {
        setShowNavbar(true);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/projects") {
      return location.pathname.startsWith("/projects");
    }

    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -90 }}
      animate={{ y: showNavbar ? 0 : -95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "bg-[#35434A]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-[#35434A]/45 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.02 }} className="shrink-0">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3"
          >
            {companyInfo.logo ? (
              <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-white/30">
                <img
                  src={companyInfo.logo}
                  alt={companyInfo.name || "Aranyak Ventures"}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            ) : (
              <div>
                <span className="text-2xl font-extrabold text-[#CDB52B]">
                  {companyInfo.name || "Aranyak Ventures"}
                </span>

                <span className="block text-xs text-white/75 tracking-[0.22em] uppercase">
                  {companyInfo.tagline || "Same Ground, Different Future"}
                </span>
              </div>
            )}
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-6 xl:gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative group pb-1 text-sm font-semibold tracking-wide transition duration-300 ${
                  isActive(link.path)
                    ? "text-[#CDB52B]"
                    : "text-white/85 hover:text-[#CDB52B]"
                }`}
              >
                {link.name}

                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-[#9CA83A] rounded-full transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href={`tel:${phoneNumber}`}
            className="border border-[#CDB52B] text-[#CDB52B] px-5 py-2.5 rounded-full hover:bg-[#CDB52B] hover:text-[#263238] transition font-bold text-sm"
          >
            📞 Call Now
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#9CA83A] hover:bg-[#CDB52B] text-white hover:text-[#263238] px-5 py-2.5 rounded-full transition font-bold text-sm shadow-lg"
          >
            Enquire Now
          </motion.a>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
          className="lg:hidden w-11 h-11 rounded-full bg-white/10 border border-white/15 text-[#CDB52B] flex items-center justify-center text-2xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#35434A]/98 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-5 py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-semibold transition ${
                    isActive(link.path)
                      ? "bg-[#CDB52B] text-[#263238]"
                      : "text-white/90 hover:bg-white/10 hover:text-[#CDB52B]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <a
                  href={`tel:${phoneNumber}`}
                  onClick={() => setMenuOpen(false)}
                  className="border border-[#CDB52B] text-[#CDB52B] px-5 py-3 rounded-2xl text-center font-bold"
                >
                  📞 Call Now
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#9CA83A] text-white px-5 py-3 rounded-2xl text-center font-bold"
                >
                  Enquire Now
                </a>
              </div>

              <p className="text-center text-white/55 text-xs mt-3 tracking-wide">
                {companyInfo.tagline || "Same Ground, Different Future"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;