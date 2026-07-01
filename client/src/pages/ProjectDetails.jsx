import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import API from "../config/api";
import companyInfo from "../data/companyInfo";
import { validateLeadForm, validateSiteVisitForm } from "../utils/validators";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [visitData, setVisitData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    remarks: "",
  });

  const [leadError, setLeadError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const [visitError, setVisitError] = useState("");
  const [visitSuccess, setVisitSuccess] = useState("");
  const [visitSubmitting, setVisitSubmitting] = useState(false);

  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 700], [1.05, 1.16]);
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0.6]);
  const titleY = useTransform(scrollY, [0, 500], [0, -70]);
  const titleOpacity = useTransform(scrollY, [0, 420], [1, 0]);

  const cleanDigits = (value) => {
    return String(value || "").replace(/\D/g, "");
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const phoneDigits = cleanDigits(companyInfo.phone || "912231864682");
  const whatsappNumber = cleanDigits(
    companyInfo.whatsapp || companyInfo.phone || "919209774755"
  );

  const callNumber = phoneDigits.startsWith("91")
    ? `+${phoneDigits}`
    : `+91${phoneDigits}`;

  const todayDate = getTodayDate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project?.price) {
      setLoanAmount(Math.round(project.price * 0.8));
    }
  }, [project]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      const projectData = res.data.data || res.data;

      setProject(projectData);
    } catch (error) {
      console.log("Project details error:", error);
    }
  };

  const handleLeadChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^\d+\s-]/g, "").slice(0, 15);
    }

    if (name === "message") {
      value = value.slice(0, 500);
    }

    setLeadError("");
    setLeadSuccess("");

    setLeadData({
      ...leadData,
      [name]: value,
    });
  };

  const handleVisitChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/[^\d+\s-]/g, "").slice(0, 15);
    }

    if (name === "remarks") {
      value = value.slice(0, 500);
    }

    setVisitError("");
    setVisitSuccess("");

    setVisitData({
      ...visitData,
      [name]: value,
    });
  };

  const submitLead = async (e) => {
    e.preventDefault();

    const validationError = validateLeadForm(leadData);

    if (validationError) {
      setLeadError(validationError);
      return;
    }

    try {
      setLeadSubmitting(true);
      setLeadError("");
      setLeadSuccess("");

      await API.post("/leads", {
        ...leadData,
        name: leadData.name.trim(),
        phone: leadData.phone.trim(),
        email: leadData.email.trim(),
        message: leadData.message.trim(),
        projectId: project._id,
        projectName: project.name,
      });

      setLeadSuccess(
        "Inquiry sent successfully ✅ Our team will contact you shortly."
      );

      setLeadData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("Lead submit error:", error);
      setLeadError("Something went wrong. Please try again ❌");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const submitSiteVisit = async (e) => {
    e.preventDefault();

    const validationError = validateSiteVisitForm({
      ...visitData,
      message: visitData.remarks,
    });

    if (validationError) {
      setVisitError(validationError);
      return;
    }

    try {
      setVisitSubmitting(true);
      setVisitError("");
      setVisitSuccess("");

      await API.post("/leads", {
        name: visitData.name.trim(),
        phone: visitData.phone.trim(),
        email: visitData.email.trim(),
        message: visitData.remarks.trim(),
        projectId: project._id,
        projectName: project.name,
        status: "Site Visit",
        siteVisit: {
          date: visitData.date,
          time: visitData.time,
          remarks: visitData.remarks.trim(),
        },
      });

      setVisitSuccess(
        "Site visit scheduled successfully ✅ Our team will confirm shortly."
      );

      setVisitData({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        remarks: "",
      });
    } catch (error) {
      console.log("Site visit submit error:", error);
      setVisitError("Site visit schedule failed. Please try again ❌");
    } finally {
      setVisitSubmitting(false);
    }
  };

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

  const calculateEMI = () => {
    const principal = Number(loanAmount);
    const monthlyRate = Number(interestRate) / 12 / 100;
    const months = Number(tenure) * 12;

    if (!principal || !monthlyRate || !months) return 0;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(emi);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6EF] px-4">
        <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#CDB52B]/30 border-t-[#CDB52B] animate-spin"></div>

          <h1 className="text-2xl font-extrabold text-[#263238] mt-6">
            Loading Project...
          </h1>
        </div>
      </div>
    );
  }

  const monthlyEMI = calculateEMI();

  const whatsappMessage = `Hello ${companyInfo.name || ""}, I am interested in ${
    project.name
  }. Please share more details.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const galleryImages = [project.image, ...(project.images || [])].filter(
    Boolean
  );

  const inputClass =
    "w-full bg-white text-[#263238] placeholder:text-slate-400 p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]";

  const darkInputClass =
    "w-full bg-white text-[#263238] placeholder:text-slate-400 p-3 rounded-xl mb-4 border border-slate-200 outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]";

  const reveal = {
    hidden: { opacity: 0, y: 25, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  const revealViewport = {
    once: false,
    amount: 0.05,
  };

  return (
    <div className="bg-[#F7F6EF] min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[82svh] md:min-h-[92vh] overflow-hidden bg-[#35434A] flex items-end">
        <motion.img
          style={{
            y: heroY,
            scale: heroScale,
            opacity: heroOpacity,
          }}
          src={project.image || "https://placehold.co/1200x700?text=Property"}
          alt={project.name}
          className="absolute inset-0 w-full h-[115%] object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#263238] via-[#35434A]/75 to-[#35434A]/20"></div>
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(205,181,43,0.22),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(156,168,58,0.18),transparent_36%)]"></div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 w-full pb-10 sm:pb-14"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white pt-28">
            <span
              className={`inline-flex px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg ${getStatusClass(
                project.status
              )}`}
            >
              {project.status || "Available"}
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-5 leading-tight max-w-5xl">
              {project.name}
            </h1>

            <p className="text-base sm:text-xl text-white/75 mt-3 leading-relaxed">
              📍 {project.location}
            </p>

            <p className="text-[#CDB52B] mt-4 font-semibold tracking-wide">
              {companyInfo.tagline || "Same Ground, Different Future"}
            </p>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            variants={reveal}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 border border-slate-100"
          >
            {/* Price + CTA */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div>
                <p className="text-slate-500 font-medium">Starting From</p>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#9CA83A] mt-1">
                  {formatPrice(project.price)}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#9CA83A] hover:bg-[#CDB52B] text-white hover:text-[#263238] px-6 py-3 rounded-full font-extrabold transition text-center shadow-lg"
                >
                  WhatsApp Now
                </motion.a>

                {project.brochure && (
                  <motion.a
                    whileHover={{ scale: 1.04, y: -2 }}
                    href={project.brochure}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#35434A] hover:bg-[#263238] text-white px-6 py-3 rounded-full font-extrabold transition text-center shadow-lg"
                  >
                    📄 Download Brochure
                  </motion.a>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              transition={{ staggerChildren: 0.03 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8"
            >
              {[
                {
                  label: "Floors",
                  value: `🏢 ${project.floors > 0 ? project.floors : "N/A"}`,
                },
                {
                  label: "Configurations",
                  value:
                    project.unitTypes?.length > 0
                      ? `🏠 ${project.unitTypes
                          .map((unit) => unit.type)
                          .join(", ")}`
                      : "🏠 N/A",
                },
                {
                  label: "Property Type",
                  value: "Residential",
                },
                {
                  label: "Status",
                  value: project.status || "Available",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={reveal}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  className="bg-[#F7F6EF] p-4 sm:p-5 rounded-2xl border border-[#CDB52B]/15"
                >
                  <p className="text-slate-500 text-sm">{item.label}</p>

                  <h3 className="font-extrabold text-[#263238] mt-1 leading-snug">
                    {item.value}
                  </h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Unit Types */}
            {project.unitTypes?.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                variants={reveal}
                transition={{ duration: 0.35 }}
                className="mt-10"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
                  Available Configurations
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mt-5">
                  {project.unitTypes.map((unit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.99 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.02, 0.06),
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-[#F7F6EF] border border-[#CDB52B]/20 rounded-3xl p-5 sm:p-6 shadow-sm"
                    >
                      <p className="text-[#9CA83A] font-extrabold">
                        {unit.type}
                      </p>

                      <h3 className="text-2xl font-extrabold text-[#263238] mt-2">
                        {unit.area > 0 ? `${unit.area} Sq.Ft.` : "Area N/A"}
                      </h3>

                      <p className="text-slate-500 mt-2">Starting Price</p>

                      <h4 className="text-xl font-extrabold text-[#CDB52B] mt-1">
                        {formatPrice(unit.price)}
                      </h4>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* EMI Calculator */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              variants={reveal}
              transition={{ duration: 0.35 }}
              className="mt-10 bg-linear-to-br from-[#35434A] to-[#263238] text-white rounded-3xl p-5 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                EMI Calculator
              </h2>

              <p className="text-white/65 mt-2">
                Estimate your monthly home loan EMI.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <input
                  type="number"
                  placeholder="Loan Amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  min="1"
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Interest Rate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  min="1"
                  max="30"
                  step="0.1"
                  className={inputClass}
                />

                <input
                  type="number"
                  placeholder="Tenure Years"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  min="1"
                  max="40"
                  className={inputClass}
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.015 }}
                className="mt-6 bg-[#CDB52B] text-[#263238] p-5 sm:p-6 rounded-2xl"
              >
                <p className="font-bold">Estimated Monthly EMI</p>

                <h3 className="text-3xl sm:text-4xl font-extrabold mt-2">
                  ₹ {monthlyEMI.toLocaleString("en-IN")}
                </h3>
              </motion.div>
            </motion.div>

            {/* Overview */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              variants={reveal}
              transition={{ duration: 0.35 }}
              className="mt-10"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
                Project Overview
              </h2>

              <p className="text-slate-600 leading-relaxed mt-4 text-base sm:text-lg">
                {project.description || "No description available."}
              </p>
            </motion.div>

            {/* Highlights */}
            {project.highlights?.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                transition={{ staggerChildren: 0.03 }}
                className="mt-10"
              >
                <motion.h2
                  variants={reveal}
                  transition={{ duration: 0.3 }}
                  className="text-2xl sm:text-3xl font-extrabold text-[#263238]"
                >
                  Project Highlights
                </motion.h2>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  {project.highlights.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={reveal}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="bg-[#CDB52B]/10 border border-[#CDB52B]/20 p-4 rounded-2xl font-bold text-[#35434A]"
                    >
                      ⭐ {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Location Advantages */}
            {project.locationAdvantages?.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                transition={{ staggerChildren: 0.03 }}
                className="mt-10"
              >
                <motion.h2
                  variants={reveal}
                  transition={{ duration: 0.3 }}
                  className="text-2xl sm:text-3xl font-extrabold text-[#263238]"
                >
                  Location Advantages
                </motion.h2>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  {project.locationAdvantages.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={reveal}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="bg-[#9CA83A]/10 border border-[#9CA83A]/20 p-4 rounded-2xl font-bold text-[#35434A]"
                    >
                      📍 {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                variants={reveal}
                transition={{ duration: 0.35 }}
                className="mt-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238]">
                    Project Gallery
                  </h2>

                  <span className="bg-[#35434A] text-white px-4 py-2 rounded-full text-sm font-bold w-fit">
                    {galleryImages.length} Photos
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {galleryImages.slice(0, 20).map((img, index) => (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.01, 0.08),
                      }}
                      whileHover={{ y: -5, scale: 1.015 }}
                      type="button"
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className="group overflow-hidden rounded-2xl border border-slate-100 shadow-sm"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition duration-500"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Amenities */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              transition={{ staggerChildren: 0.03 }}
              className="mt-10"
            >
              <motion.h2
                variants={reveal}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl font-extrabold text-[#263238]"
              >
                Amenities
              </motion.h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                {[
                  ["🛡️", "24x7 Security"],
                  ["🚗", "Parking"],
                  ["🛗", "Lift"],
                  ["⚡", "Power Backup"],
                  ["🌳", "Garden"],
                  ["💧", "Water Supply"],
                ].map(([icon, item]) => (
                  <motion.div
                    key={item}
                    variants={reveal}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-[#F7F6EF] border border-slate-100 p-4 rounded-2xl font-bold text-[#35434A]"
                  >
                    {icon} {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            {project.mapLink && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={revealViewport}
                variants={reveal}
                transition={{ duration: 0.35 }}
                className="mt-10"
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263238] mb-5">
                  Project Location
                </h2>

                <iframe
                  src={project.mapLink}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="rounded-3xl shadow border border-slate-100 h-80 sm:h-112.5"
                  title={`${project.name} Location`}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.35 }}
          className="lg:sticky lg:top-32 h-fit space-y-6"
        >
          {/* Inquiry Form */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl shadow-xl p-5 sm:p-7 border border-slate-100"
          >
            <h2 className="text-2xl font-extrabold text-[#263238]">
              Interested in this Property?
            </h2>

            <p className="text-slate-500 mt-2">
              Fill the form and our team will contact you shortly.
            </p>

            <form onSubmit={submitLead} className="mt-6">
              {leadError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
                  {leadError}
                </div>
              )}

              {leadSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
                  {leadSuccess}
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={leadData.name}
                onChange={handleLeadChange}
                autoComplete="name"
                className="w-full border border-slate-200 focus:border-[#CDB52B] focus:ring-2 focus:ring-[#CDB52B]/30 outline-none p-3 rounded-xl mb-4"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={leadData.phone}
                onChange={handleLeadChange}
                inputMode="tel"
                maxLength="15"
                autoComplete="tel"
                className="w-full border border-slate-200 focus:border-[#CDB52B] focus:ring-2 focus:ring-[#CDB52B]/30 outline-none p-3 rounded-xl mb-4"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={leadData.email}
                onChange={handleLeadChange}
                autoComplete="email"
                className="w-full border border-slate-200 focus:border-[#CDB52B] focus:ring-2 focus:ring-[#CDB52B]/30 outline-none p-3 rounded-xl mb-4"
              />

              <textarea
                name="message"
                placeholder="Message"
                value={leadData.message}
                onChange={handleLeadChange}
                rows="4"
                maxLength="500"
                className="w-full border border-slate-200 focus:border-[#CDB52B] focus:ring-2 focus:ring-[#CDB52B]/30 outline-none p-3 rounded-xl mb-2"
              />

              <p className="text-right text-xs text-slate-400 mb-4">
                {leadData.message.length}/500 characters
              </p>

              <motion.button
                whileHover={{
                  scale: leadSubmitting ? 1 : 1.025,
                  y: leadSubmitting ? 0 : -2,
                }}
                whileTap={{ scale: leadSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={leadSubmitting}
                className="w-full bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-extrabold transition"
              >
                {leadSubmitting ? "Sending..." : "Send Inquiry"}
              </motion.button>
            </form>
          </motion.div>

          {/* Site Visit Form */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-[#35434A] to-[#263238] text-white rounded-3xl shadow-xl p-5 sm:p-7"
          >
            <h2 className="text-2xl font-extrabold">Schedule Site Visit</h2>

            <p className="text-white/65 mt-2">
              Choose your preferred date and time for a site visit.
            </p>

            <form onSubmit={submitSiteVisit} className="mt-6">
              {visitError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-semibold">
                  {visitError}
                </div>
              )}

              {visitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-semibold">
                  {visitSuccess}
                </div>
              )}

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={visitData.name}
                onChange={handleVisitChange}
                autoComplete="name"
                className={darkInputClass}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={visitData.phone}
                onChange={handleVisitChange}
                inputMode="tel"
                maxLength="15"
                autoComplete="tel"
                className={darkInputClass}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={visitData.email}
                onChange={handleVisitChange}
                autoComplete="email"
                className={darkInputClass}
              />

              <input
                type="date"
                name="date"
                value={visitData.date}
                onChange={handleVisitChange}
                min={todayDate}
                className={darkInputClass}
                required
              />

              <input
                type="time"
                name="time"
                value={visitData.time}
                onChange={handleVisitChange}
                className={darkInputClass}
                required
              />

              <textarea
                name="remarks"
                placeholder="Remarks"
                value={visitData.remarks}
                onChange={handleVisitChange}
                rows="3"
                maxLength="500"
                className="w-full bg-white text-[#263238] placeholder:text-slate-400 p-3 rounded-xl mb-2 border border-slate-200 outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B]"
              />

              <p className="text-right text-xs text-white/45 mb-4">
                {visitData.remarks.length}/500 characters
              </p>

              <motion.button
                whileHover={{
                  scale: visitSubmitting ? 1 : 1.025,
                  y: visitSubmitting ? 0 : -2,
                }}
                whileTap={{ scale: visitSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={visitSubmitting}
                className="w-full bg-[#CDB52B] hover:bg-[#9CA83A] disabled:bg-[#CDB52B]/50 disabled:cursor-not-allowed text-[#263238] px-8 py-3 rounded-xl font-extrabold transition"
              >
                {visitSubmitting ? "Scheduling..." : "📅 Schedule Visit"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Call Button */}
      <motion.a
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        href={`tel:${callNumber}`}
        aria-label="Call Now"
        className="fixed bottom-24 right-5 sm:right-6 z-50 bg-[#CDB52B] hover:bg-[#9CA83A] w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[#263238] text-2xl shadow-xl"
      >
        📞
      </motion.a>

      {/* Image Preview Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 bg-white text-[#263238] w-11 h-11 rounded-full text-2xl font-bold z-10"
          >
            ×
          </button>

          <motion.img
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            src={selectedImage}
            alt="Preview"
            className="max-w-5xl max-h-[82vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </div>
  );
}

export default ProjectDetails;