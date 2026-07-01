import { Link } from "react-router-dom";
import companyInfo from "../data/companyInfo";

function PrivacyPolicy() {
  const companyName = companyInfo.name || "Aranyak Ventures";
  const email = companyInfo.email || "contact@aranyakventures.com";
  const phone = companyInfo.phone || "+91 8127819848";
  const whatsapp = companyInfo.whatsapp || "+91 8127819848";
  const address =
    companyInfo.address ||
    "306, Tulsi Syam CHS, Teen Hath Naka, Thane West, Maharashtra 400604";

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We may collect your name, phone number, email address, project preference, site visit details, inquiry message, and any information you submit through our contact forms, project inquiry forms, chatbot, or WhatsApp links.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use your information to contact you regarding property inquiries, schedule site visits, share project details, respond to your questions, provide customer support, and improve our services.",
    },
    {
      title: "3. Lead & Inquiry Data",
      content:
        "When you submit an inquiry on our website, your details may be stored in our internal CRM system so our team can follow up with you professionally and manage the sales process.",
    },
    {
      title: "4. Data Sharing",
      content:
        "We do not sell your personal information. We may share your information only with authorized team members, project representatives, or service providers when required to respond to your inquiry or provide requested services.",
    },
    {
      title: "5. Data Security",
      content:
        "We take reasonable technical and organizational steps to protect your information from unauthorized access, misuse, or disclosure. However, no online system can be guaranteed to be completely secure.",
    },
    {
      title: "6. Cookies & Website Analytics",
      content:
        "Our website may use basic cookies or analytics tools to understand visitor behavior, improve user experience, and monitor website performance.",
    },
    {
      title: "7. Your Rights",
      content:
        "You may contact us to request access, correction, update, or deletion of your personal information, subject to applicable laws and business requirements.",
    },
    {
      title: "8. Third-Party Links",
      content:
        "Our website may contain links to third-party websites such as WhatsApp, Google Maps, or external project resources. We are not responsible for the privacy practices of those third-party platforms.",
    },
    {
      title: "9. Policy Updates",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.",
    },
  ];

  return (
    <div className="bg-[#F7F6EF] min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white pt-32 pb-16 sm:pb-20">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#CDB52B] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
            Legal Information
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            Privacy Policy
          </h1>

          <p className="text-white/65 max-w-3xl mx-auto mt-5 leading-relaxed">
            This Privacy Policy explains how {companyName} collects, uses, and
            protects information submitted through this website.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5 sm:p-8">
          <div className="bg-[#F7F6EF] border border-[#CDB52B]/20 rounded-2xl p-4 sm:p-5 mb-8">
            <p className="text-[#263238] font-bold">
              Effective Date: {new Date().toLocaleDateString("en-IN")}
            </p>

            <p className="text-slate-600 mt-2 leading-relaxed">
              This is a general privacy policy template for a real estate
              inquiry website. Please review and customize it according to your
              final business process.
            </p>
          </div>

          <div className="space-y-7">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                  {section.title}
                </h2>

                <p className="text-slate-600 mt-3 leading-relaxed wrap-break-word">
                  {section.content}
                </p>
              </div>
            ))}

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#263238]">
                10. Contact Us
              </h2>

              <div className="text-slate-600 mt-3 leading-relaxed space-y-2">
                <p>
                  For privacy-related questions or requests, you can contact us:
                </p>
                <p>📞 {phone}</p>
                <p>💬 {whatsapp}</p>
                <p>✉️ {email}</p>
                <p>📍 {address}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="bg-[#35434A] hover:bg-[#263238] text-white px-6 py-3 rounded-full font-extrabold text-center transition"
            >
              Contact Us
            </Link>

            <Link
              to="/"
              className="border border-[#35434A] text-[#35434A] hover:bg-[#35434A] hover:text-white px-6 py-3 rounded-full font-extrabold text-center transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;