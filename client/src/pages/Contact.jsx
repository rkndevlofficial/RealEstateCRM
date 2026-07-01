import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import API from "../config/api";
import companyInfo from "../data/companyInfo";
import { validateLeadForm } from "../utils/validators";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 600], [1.05, 1.17]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -75]);
  const heroTextOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  const phoneNumber =
    companyInfo.phone?.replace(/[^\d+]/g, "") || "+912231864682";

  const whatsappNumber = String(
    companyInfo.whatsapp || "919209774755"
  ).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello ${companyInfo.name || "Aranyak Ventures"}, I am interested in your property projects. Please share more details.`
  );

  const emailAddress = companyInfo.email || "contact@aranyakventures.com";

  const officeAddress =
    companyInfo.address ||
    "306, Tulsi Syam CHS, Teen Hath Naka, Thane West, Maharashtra 400604";

  const workingHours =
    companyInfo.workingHours || "Monday - Saturday, 10:00 AM - 7:00 PM";

  const mapQuery = encodeURIComponent(officeAddress);

  const contactCards = [
    {
      icon: "📞",
      title: "Call Us",
      value: companyInfo.phone || "+91 22 3186 4682",
      href: `tel:${phoneNumber}`,
    },
    {
      icon: "✉️",
      title: "Email Us",
      value: emailAddress,
      href: `mailto:${emailAddress}`,
    },
    {
      icon: "📍",
      title: "Visit Office",
      value: officeAddress,
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    },
  ];

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^\d+\s-]/g, "").slice(0, 15);
    }

    if (name === "message") {
      value = value.slice(0, 500);
    }

    setFormError("");
    setFormSuccess("");

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitInquiry = async (e) => {
    e.preventDefault();

    const validationError = validateLeadForm(formData);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setFormSuccess("");

      await API.post("/leads", {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        projectName: "General Inquiry",
      });

      setFormSuccess(
        "Inquiry sent successfully ✅ Our team will contact you shortly."
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      setFormError("Something went wrong. Please try again ❌");
    } finally {
      setSubmitting(false);
    }
  };

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
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d')] bg-cover bg-center opacity-45"
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
              Contact Us
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2 leading-tight">
            Get In Touch
          </h1>

          <p className="text-white/75 max-w-2xl mx-auto mt-5 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed">
            Have questions about our properties? Our team is ready to guide you
            with trusted support and transparent real estate advice.
          </p>

          <p className="text-[#CDB52B] mt-5 font-semibold tracking-wide">
            {companyInfo.tagline || "Same Ground, Different Future"}
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Contact Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={revealViewport}
          transition={{ staggerChildren: 0.1 }}
          className="grid md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12"
        >
          {contactCards.map((card, index) => (
            <motion.a
              key={index}
              href={card.href}
              target={card.title === "Visit Office" ? "_blank" : undefined}
              rel={card.title === "Visit Office" ? "noreferrer" : undefined}
              variants={reveal}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.08, 0.2),
              }}
              whileHover={{ y: -8, scale: 1.015 }}
              className="group bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-100 overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-linear-to-br from-[#CDB52B]/10 to-[#9CA83A]/10"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-3xl mb-5">
                  {card.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                  {card.title}
                </h3>

                <p className="text-slate-500 mt-2 wrap-break-word leading-relaxed">
                  {card.value}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Inquiry Form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={leftReveal}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 border border-slate-100"
          >
            <p className="text-[#9CA83A] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
              Send Message
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#263238]">
              Send Inquiry
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Fill the form and our team will contact you shortly with the best
              property guidance.
            </p>

            <form onSubmit={submitInquiry} className="mt-7 sm:mt-8">
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
                  {formSuccess}
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                className="w-full border border-slate-200 p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                inputMode="tel"
                maxLength="15"
                autoComplete="tel"
                className="w-full border border-slate-200 p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full border border-slate-200 p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]"
              />

              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                maxLength="500"
                className="w-full border border-slate-200 p-4 rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]"
              />

              <p className="text-right text-xs text-slate-400 mb-4">
                {formData.message.length}/500 characters
              </p>

              <motion.button
                whileHover={{
                  scale: submitting ? 1 : 1.02,
                  y: submitting ? 0 : -2,
                }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-extrabold transition shadow-lg"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </motion.button>
            </form>
          </motion.div>

          {/* Office Details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={rightReveal}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="bg-linear-to-br from-[#35434A] to-[#263238] rounded-3xl shadow-xl p-5 sm:p-8 text-white overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <p className="text-[#CDB52B] font-extrabold mb-3 tracking-[0.22em] uppercase text-xs sm:text-sm">
                Visit Our Office
              </p>

              {companyInfo.logo && (
                <div className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-white/30 w-fit mb-5">
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name || "Aranyak Ventures"}
                    className="h-14 w-auto object-contain"
                  />
                </div>
              )}

              <h2 className="text-3xl sm:text-4xl font-extrabold">
                {companyInfo.name || "Aranyak Ventures"}
              </h2>

              <p className="text-white/65 mt-4 leading-relaxed">
                Our expert property consultants are available to guide you
                through every step of your property journey.
              </p>

              <div className="space-y-4 mt-8 text-white/75">
                <p className="leading-relaxed">📍 {officeAddress}</p>

                <a
                  href={`tel:${phoneNumber}`}
                  className="block hover:text-[#CDB52B] transition"
                >
                  📞 {companyInfo.phone || "+91 22 3186 4682"}
                </a>

                <a
                  href={`mailto:${emailAddress}`}
                  className="block hover:text-[#CDB52B] transition wrap-break-word"
                >
                  ✉️ {emailAddress}
                </a>

                <p>🕒 {workingHours}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ duration: 0.65 }}
                className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-xl"
              >
                <iframe
                  title={`${companyInfo.name || "Aranyak Ventures"} Location`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="w-full h-72 sm:h-80 border-0"
                  loading="lazy"
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 55, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mt-12 sm:mt-16 bg-linear-to-r from-[#35434A] to-[#263238] rounded-3xl p-6 sm:p-10 text-center text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-24 left-10 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 right-10 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Ready To Visit Your Dream Property?
            </h2>

            <p className="text-white/65 mt-3 max-w-2xl mx-auto leading-relaxed">
              Call us today or send an inquiry to schedule your site visit with
              {companyInfo.name ? ` ${companyInfo.name}` : " our team"}.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                href={`tel:${phoneNumber}`}
                className="bg-[#CDB52B] text-[#263238] px-7 py-3 rounded-full font-extrabold hover:bg-[#9CA83A] transition text-center"
              >
                Call Now
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="border border-[#CDB52B] text-[#CDB52B] px-7 py-3 rounded-full font-extrabold hover:bg-[#CDB52B] hover:text-[#263238] transition text-center"
              >
                WhatsApp
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default Contact;