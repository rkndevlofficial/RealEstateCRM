import { Link } from "react-router-dom";
import companyInfo from "../data/companyInfo";

function TermsConditions() {
  const companyName = companyInfo.name || "Aranyak Ventures";
  const email = companyInfo.email || "contact@aranyakventures.com";
  const phone = companyInfo.phone || "+91 22 3186 4682";
  const address =
    companyInfo.address ||
    "306, Tulsi Syam CHS, Teen Hath Naka, Thane West, Maharashtra 400604";

  const sections = [
    {
      title: "1. Website Usage",
      content:
        "By using this website, you agree to use it only for lawful purposes and in a way that does not harm, misuse, or disrupt the website or its services.",
    },
    {
      title: "2. Property Information",
      content:
        "Property details, prices, availability, images, floor plans, brochures, and other information displayed on this website are provided for general informational purposes and may change without prior notice.",
    },
    {
      title: "3. Price & Availability Disclaimer",
      content:
        "Prices, offers, unit availability, possession timelines, and project details are subject to change based on developer updates, market conditions, approvals, and final confirmation from the authorized team.",
    },
    {
      title: "4. No Final Booking Through Website Alone",
      content:
        "Submitting an inquiry form or contacting us through the website does not confirm booking, allotment, reservation, or purchase of any property. Final booking is subject to documentation, payment, verification, and official confirmation.",
    },
    {
      title: "5. Images & Visuals",
      content:
        "Images, renders, layouts, and visuals shown on the website may be for representation purposes only. Actual project appearance, specifications, amenities, and dimensions may vary.",
    },
    {
      title: "6. User Submitted Information",
      content:
        "When you submit your details through forms, chatbot, WhatsApp, or other contact options, you agree that our team may contact you regarding your inquiry, project information, site visits, and related services.",
    },
    {
      title: "7. Third-Party Services",
      content:
        "This website may include links or integrations with third-party services such as WhatsApp, Google Maps, payment platforms, or external websites. We are not responsible for third-party content, services, or policies.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "We try to keep all information accurate and updated, but we do not guarantee that every detail will always be error-free or complete. Users should verify all details before making any property decision.",
    },
    {
      title: "9. Changes to Terms",
      content:
        "We may update these Terms & Conditions at any time. Continued use of the website after updates means you accept the revised terms.",
    },
  ];

  return (
    <div className="bg-[#F7F6EF] min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-r from-[#35434A] via-[#263238] to-[#35434A] text-white pt-32 pb-16 sm:pb-20">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#CDB52B] font-extrabold tracking-[0.22em] uppercase text-xs sm:text-sm mb-3">
            Website Terms
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            Terms & Conditions
          </h1>

          <p className="text-white/65 max-w-3xl mx-auto mt-5 leading-relaxed">
            Please read these terms carefully before using the {companyName}
            website.
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
              These terms are written for a real estate website and should be
              reviewed with the final business details before client delivery.
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
                10. Contact Information
              </h2>

              <div className="text-slate-600 mt-3 leading-relaxed space-y-2">
                <p>For any questions related to these terms, contact us:</p>
                <p>📞 {phone}</p>
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

export default TermsConditions;