import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../config/api";
import companyInfo from "../data/companyInfo";

function Investment() {
  const [projects, setProjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    investmentType: "",
    interestedProject: "",
    investmentGoal: "",
    message: "",
    consent: false,
  });

  const budgetOptions = [
    "Below ₹5 Lakh",
    "₹5 Lakh - ₹10 Lakh",
    "₹10 Lakh - ₹25 Lakh",
    "₹25 Lakh - ₹50 Lakh",
    "₹50 Lakh+",
  ];

  const investmentTypes = [
    "Rental Income Opportunity",
    "Long-term Property Investment",
    "Fractional Real Estate Interest",
    "Project Partnership Inquiry",
    "General Investment Inquiry",
  ];

  const investmentGoals = [
    "Monthly Rental Income",
    "Long-term Capital Growth",
    "Diversified Real Estate Portfolio",
    "Second Income Source",
    "Business / Partnership Opportunity",
  ];

  const highlights = [
    {
      title: "Real Estate Backed Interest",
      desc: "Explore property-based opportunities where interested visitors can request details before taking any decision.",
      icon: "🏢",
    },
    {
      title: "No Online Payment",
      desc: "This module only collects interest. No payment, booking, or investment confirmation is done online.",
      icon: "🛡️",
    },
    {
      title: "Advisor Callback",
      desc: "Once a visitor submits interest, the admin team can follow up through CRM and explain suitable options.",
      icon: "🤝",
    },
    {
      title: "Transparent Discussion",
      desc: "Budget, goal, risk, timeline, and project details can be discussed before sharing any proposal.",
      icon: "📋",
    },
  ];

  const criteria = [
    "Visitor should review the basic investment information carefully.",
    "Investment interest depends on budget, project availability, and company discussion.",
    "Final documents, legal process, risk details, and returns must be explained by the company team.",
    "This website does not guarantee return, profit, rental income, or investment approval.",
  ];

  const processSteps = [
    {
      step: "01",
      title: "Explore Criteria",
      desc: "Visitor checks investment types, criteria, and important disclaimer.",
    },
    {
      step: "02",
      title: "Submit Interest",
      desc: "Visitor fills budget, investment goal, project preference, and contact details.",
    },
    {
      step: "03",
      title: "CRM Lead Created",
      desc: "Lead is saved inside admin CRM as Investment Inquiry for follow-up.",
    },
    {
      step: "04",
      title: "Consultation Call",
      desc: "Team contacts the visitor and explains suitable options personally.",
    },
  ];

  const faqs = [
    {
      question: "Is this an online investment platform?",
      answer:
        "No. This page only collects investment interest. Final details are discussed directly with the company team.",
    },
    {
      question: "Can I invest directly from this website?",
      answer:
        "No. Online payment or direct investment confirmation is not available on this page.",
    },
    {
      question: "Are returns guaranteed?",
      answer:
        "No. Returns are not guaranteed. Real estate investment depends on market conditions, project performance, legal process, and other risks.",
    },
    {
      question: "What happens after I submit interest?",
      answer:
        "Your inquiry will be received by the admin team, and they can contact you for further discussion.",
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setProjects(data);
    } catch (error) {
      console.log("Project fetch error:", error.response?.data || error);
      setProjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getDigitsOnly = (value) => {
    return String(value || "").replace(/\D/g, "");
  };

  const isValidIndianPhone = (phone) => {
    const digits = getDigitsOnly(phone);

    if (digits.length === 10) return true;
    if (digits.length === 12 && digits.startsWith("91")) return true;

    return false;
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.name.trim().length < 2)
      return "Name must be at least 2 characters";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!isValidIndianPhone(formData.phone))
      return "Enter a valid 10 digit phone number";
    if (!formData.budget) return "Please select investment budget";
    if (!formData.investmentType) return "Please select investment type";
    if (!formData.investmentGoal) return "Please select investment goal";
    if (!formData.consent)
      return "Please confirm that you understand this is only an inquiry";

    return null;
  };

  const submitInvestmentLead = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      alert(error);
      return;
    }

    try {
      setSubmitting(true);

      const message = `
Investment Budget: ${formData.budget}
Investment Type: ${formData.investmentType}
Investment Goal: ${formData.investmentGoal}
Interested Project: ${formData.interestedProject || "Not specified"}
Message: ${formData.message || "No extra message"}
Source: Investment Page
      `.trim();

      await API.post("/leads", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        projectName: "Investment Inquiry",
        message,
        status: "New",
      });

      alert("Investment interest submitted successfully ✅");

      setFormData({
        name: "",
        phone: "",
        email: "",
        budget: "",
        investmentType: "",
        interestedProject: "",
        investmentGoal: "",
        message: "",
        consent: false,
      });
    } catch (error) {
      console.log("Investment lead submit error:", error.response?.data || error);
      alert(error.response?.data?.message || "Unable to submit inquiry ❌");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-slate-200 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CDB52B] focus:border-[#CDB52B] transition text-[#263238]";

  return (
    <main className="bg-[#F7F6EF] text-[#263238]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#35434A] text-white pt-28 sm:pt-32 pb-16 sm:pb-24">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <p className="text-[#CDB52B] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-4">
                Real Estate Investment Interest
              </p>

              <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
                Explore Property-Based Investment Opportunities
              </h1>

              <p className="text-white/72 mt-5 text-base sm:text-lg leading-relaxed max-w-2xl">
                Discover investment interest criteria, opportunity types, and
                request a callback from the {companyInfo.name || "Aranyak Ventures"} team.
              </p>

              <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-extrabold text-[#CDB52B]">0₹</p>
                  <p className="text-xs text-white/60 mt-1">Online Payment</p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-extrabold text-[#CDB52B]">CRM</p>
                  <p className="text-xs text-white/60 mt-1">Lead Tracking</p>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-extrabold text-[#CDB52B]">100%</p>
                  <p className="text-xs text-white/60 mt-1">Inquiry Based</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="#investment-form"
                  className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-7 py-4 rounded-full font-extrabold transition text-center shadow-lg"
                >
                  Register Interest
                </a>

                <a
                  href="#criteria"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/15 px-7 py-4 rounded-full font-extrabold transition text-center"
                >
                  View Criteria
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
              className="bg-white/10 border border-white/10 rounded-4xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="bg-white rounded-3xl p-6 text-[#263238]">
                <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-3">
                  Investor Snapshot
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Submit Interest, Not Payment
                </h2>

                <p className="text-slate-500 mt-3 leading-relaxed">
                  Visitors can select investment budget, goal, and opportunity
                  type. The admin team will receive the inquiry inside CRM.
                </p>

                <div className="space-y-3 mt-6">
                  {[
                    "Budget-based investor filtering",
                    "Project preference collection",
                    "CRM lead follow-up support",
                    "Disclaimer-based safe inquiry flow",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 bg-[#F7F6EF] rounded-2xl p-4 border border-[#CDB52B]/15"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#CDB52B] flex items-center justify-center font-extrabold">
                        ✓
                      </span>

                      <p className="font-bold text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <p className="text-slate-600 text-sm leading-relaxed">
            <span className="font-extrabold text-[#263238]">Important:</span>{" "}
            This page is only for collecting investment interest. It does not
            collect payment, does not confirm any investment, and does not
            guarantee returns. Final details, documents, and risk information
            should be discussed directly with the company team.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">
              Professional Investment Inquiry
            </p>

            <h2 className="text-3xl sm:text-5xl font-extrabold">
              Built for Serious Investor Leads
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              This module helps the company capture interested investors without
              taking online payments or making unsafe promises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-3xl p-6 shadow border border-slate-100 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F7F6EF] border border-[#CDB52B]/20 flex items-center justify-center text-3xl mb-5">
                  {item.icon}
                </div>

                <h3 className="text-xl font-extrabold">{item.title}</h3>

                <p className="text-slate-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Criteria + Opportunity */}
      <section id="criteria" className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-slate-100">
              <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs mb-3">
                Criteria
              </p>

              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Investment Interest Criteria
              </h2>

              <div className="space-y-4 mt-7">
                {criteria.map((item) => (
                  <div key={item} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#CDB52B] text-[#263238] flex items-center justify-center font-extrabold shrink-0">
                      ✓
                    </div>

                    <p className="text-slate-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#35434A] rounded-4xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <p className="text-[#CDB52B] font-extrabold tracking-[0.18em] uppercase text-xs mb-3">
                  Opportunity Types
                </p>

                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  What Investors Can Show Interest In
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 mt-7">
                  {investmentTypes.map((type) => (
                    <div
                      key={type}
                      className="bg-white/10 border border-white/10 rounded-2xl p-4"
                    >
                      <p className="font-extrabold">{type}</p>
                    </div>
                  ))}
                </div>

                <p className="text-white/60 text-sm leading-relaxed mt-6">
                  Final investment structure, documents, return expectations,
                  risk, and eligibility should be explained after personal
                  consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">
              Process
            </p>

            <h2 className="text-3xl sm:text-5xl font-extrabold">
              How Investment Inquiry Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow"
              >
                <div className="text-4xl font-extrabold text-[#CDB52B]">
                  {item.step}
                </div>

                <h3 className="text-xl font-extrabold mt-4">{item.title}</h3>

                <p className="text-slate-500 leading-relaxed mt-3">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="investment-form" className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-[#35434A] text-white rounded-4xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <p className="text-[#CDB52B] font-extrabold tracking-[0.18em] uppercase text-xs mb-3">
                  Register Interest
                </p>

                <h2 className="text-3xl sm:text-4xl font-extrabold">
                  Ready to Discuss Investment Options?
                </h2>

                <p className="text-white/65 mt-4 leading-relaxed">
                  Fill this form and the team will contact you with suitable
                  details. Your inquiry will be stored in the admin CRM.
                </p>

                <div className="space-y-4 mt-8">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="font-extrabold text-[#CDB52B]">
                      Lead Category
                    </p>
                    <p className="text-white/70 mt-1">Investment Inquiry</p>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="font-extrabold text-[#CDB52B]">
                      Admin Action
                    </p>
                    <p className="text-white/70 mt-1">
                      Follow-up, call, notes, and status update
                    </p>
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="font-extrabold text-[#CDB52B]">
                      Safe Flow
                    </p>
                    <p className="text-white/70 mt-1">
                      No direct payment or investment confirmation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-4xl shadow-xl border border-slate-100 p-6 sm:p-8">
              <form onSubmit={submitInvestmentLead} className="grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">
                      Investment Budget *
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select budget</option>
                      {budgetOptions.map((budget) => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold mb-2">
                      Investment Type *
                    </label>
                    <select
                      name="investmentType"
                      value={formData.investmentType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select investment type</option>
                      {investmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-2">
                      Investment Goal *
                    </label>
                    <select
                      name="investmentGoal"
                      value={formData.investmentGoal}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select investment goal</option>
                      {investmentGoals.map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2">
                    Interested Project
                  </label>

                  <select
                    name="interestedProject"
                    value={formData.interestedProject}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select project if any</option>

                    {projects.map((project) => (
                      <option key={project._id} value={project.name}>
                        {project.name} {project.location ? `- ${project.location}` : ""}
                      </option>
                    ))}

                    <option value="Not sure / Need guidance">
                      Not sure / Need guidance
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-2">Message</label>
                  <textarea
                    name="message"
                    placeholder="Write your requirement or question"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    maxLength="500"
                    className={inputClass}
                  />

                  <p className="text-right text-xs text-slate-400 mt-2">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <label className="flex items-start gap-3 bg-[#F7F6EF] border border-[#CDB52B]/15 rounded-2xl p-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 accent-[#CDB52B]"
                  />

                  <span className="text-sm text-slate-600 leading-relaxed">
                    I understand that this is only an investment interest
                    inquiry. It is not an investment confirmation, payment
                    request, or guaranteed return offer.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#35434A] hover:bg-[#CDB52B] hover:text-[#263238] disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-extrabold transition shadow-lg"
                >
                  {submitting ? "Submitting..." : "Submit Investment Interest"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#9CA83A] font-extrabold tracking-[0.18em] uppercase text-xs sm:text-sm mb-3">
              Investor FAQ
            </p>

            <h2 className="text-3xl sm:text-5xl font-extrabold">
              Common Questions
            </h2>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white rounded-3xl p-6 shadow border border-slate-100"
              >
                <h3 className="font-extrabold text-lg">{faq.question}</h3>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Investment;