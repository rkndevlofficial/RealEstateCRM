import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import companyInfo from "../data/companyInfo";

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  const companyName = companyInfo.name || "Aranyak Ventures";

  const faqs = [
    {
      question: "How can I inquire about a property project?",
      answer:
        "You can submit an inquiry through the project details page, contact form, AI chatbot, or WhatsApp button. Our team will connect with you and share project details.",
    },
    {
      question: "Can I schedule a site visit?",
      answer:
        "Yes, you can request a site visit from the project details page or through the chatbot. Our team will confirm the available date and time with you.",
    },
    {
      question: "Are the prices shown on the website final?",
      answer:
        "Prices shown on the website are for information purposes and may change based on availability, developer updates, offers, and final confirmation.",
    },
    {
      question: "Do you provide project brochure and floor plans?",
      answer:
        "Yes, if brochure, floor plans, or gallery images are available for a project, you can view or download them from the project details page.",
    },
    {
      question: "Can I contact the team on WhatsApp?",
      answer:
        "Yes, you can click the WhatsApp button on any page. The message will automatically include details based on the page or project you are viewing.",
    },
    {
      question: "Do you list multiple real estate projects?",
      answer:
        "Yes, the website supports multiple projects with details such as location, price, status, unit types, gallery, brochure, and inquiry options.",
    },
    {
      question: "Is submitting an inquiry equal to booking a flat?",
      answer:
        "No. Submitting an inquiry only helps our team contact you. Final booking depends on documentation, payment, verification, and official confirmation.",
    },
  ];

  return (
    <div className="bg-[#F7F6EF] min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white pt-32 pb-16 sm:pb-20">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#CDB52B] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
            Help Center
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            Frequently Asked Questions
          </h1>

          <p className="text-white/65 max-w-3xl mx-auto mt-5 leading-relaxed">
            Find answers to common questions about property projects, inquiries,
            site visits, pricing, and support from {companyName}.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5"
                >
                  <span className="text-[#263238] font-extrabold text-base sm:text-lg">
                    {faq.question}
                  </span>

                  <span className="w-9 h-9 shrink-0 rounded-full bg-[#F7F6EF] text-[#35434A] flex items-center justify-center font-extrabold">
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 text-slate-600 leading-relaxed wrap-break-word">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-[#35434A] rounded-3xl p-6 sm:p-8 text-white text-center shadow-xl">
          <p className="text-[#CDB52B] font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">
            Still have questions?
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Talk to our property team
          </h2>

          <p className="text-white/65 mt-3 max-w-2xl mx-auto leading-relaxed">
            Share your requirement and our team will help you with project
            details, pricing, availability, and site visit support.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-6 py-3 rounded-full font-extrabold text-center transition"
            >
              Contact Us
            </Link>

            <Link
              to="/projects"
              className="border border-[#CDB52B] text-[#CDB52B] hover:bg-[#CDB52B] hover:text-[#263238] px-6 py-3 rounded-full font-extrabold text-center transition"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;