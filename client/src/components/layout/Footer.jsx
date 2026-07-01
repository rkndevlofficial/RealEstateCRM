import { Link } from "react-router-dom";
import companyInfo from "../../data/companyInfo";

function Footer() {
  const currentYear = new Date().getFullYear();

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

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Investment", path: "/investment" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#35434A] text-white">
      {/* Background Glow */}
      <div className="absolute -top-28 -left-28 w-80 h-80 bg-[#CDB52B]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[#9CA83A]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top CTA */}
        <div className="bg-white/8 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-[#CDB52B] font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm">
                Start Your Property Journey
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
                Find a space built for your future.
              </h2>

              <p className="text-white/70 mt-3 max-w-2xl leading-relaxed">
                Connect with {companyInfo.name || "Aranyak Ventures"} for
                trusted real estate guidance, premium projects, investment
                interest, and transparent property support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/investment"
                className="bg-white/10 hover:bg-white/15 border border-white/15 text-white px-6 py-3 rounded-full font-bold text-center transition"
              >
                📈 Investment Interest
              </Link>

              <a
                href={`tel:${phoneNumber}`}
                className="bg-[#CDB52B] hover:bg-[#9CA83A] text-[#263238] px-6 py-3 rounded-full font-bold text-center transition shadow-lg"
              >
                📞 Call Now
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="border border-[#CDB52B] text-[#CDB52B] hover:bg-[#CDB52B] hover:text-[#263238] px-6 py-3 rounded-full font-bold text-center transition"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center">
              {companyInfo.logo ? (
                <div className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-white/30">
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.name || "Aranyak Ventures"}
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-extrabold text-[#CDB52B]">
                  {companyInfo.name || "Aranyak Ventures"}
                </h2>
              )}
            </Link>

            <p className="text-[#CDB52B] mt-5 font-semibold tracking-wide">
              {companyInfo.tagline || "Same Ground, Different Future"}
            </p>

            <p className="text-white/65 mt-4 max-w-md leading-relaxed">
              {companyInfo.shortDescription ||
                "Premium real estate projects with verified details, trusted support, prime locations, and easy inquiry options."}
            </p>

            <div className="flex gap-4 mt-7">
              <a
                href={companyInfo.socialLinks?.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 bg-white/10 hover:bg-[#CDB52B] hover:text-[#263238] rounded-full flex items-center justify-center transition font-bold"
              >
                f
              </a>

              <a
                href={companyInfo.socialLinks?.linkedin || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 bg-white/10 hover:bg-[#CDB52B] hover:text-[#263238] rounded-full flex items-center justify-center transition font-bold"
              >
                in
              </a>

              <a
                href={companyInfo.socialLinks?.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 bg-white/10 hover:bg-[#CDB52B] hover:text-[#263238] rounded-full flex items-center justify-center transition font-bold"
              >
                ig
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-extrabold mb-5 text-lg text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-white/65">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-[#CDB52B] transition w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-extrabold mb-5 text-lg text-white">Legal</h3>

            <div className="flex flex-col gap-3 text-white/65">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="hover:text-[#CDB52B] transition w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-extrabold mb-5 text-lg text-white">Contact</h3>

            <div className="space-y-4 text-white/65">
              <p className="leading-relaxed">
                📍{" "}
                {companyInfo.address ||
                  "306, Tulsi Syam CHS, Teen Hath Naka, Thane West, Maharashtra 400604"}
              </p>

              <a
                href={`tel:${phoneNumber}`}
                className="block hover:text-[#CDB52B] transition"
              >
                📞 {companyInfo.phone || "+91 22 3186 4682"}
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[#CDB52B] transition"
              >
                💬 WhatsApp Us
              </a>

              <a
                href={`mailto:${
                  companyInfo.email || "contact@aranyakventures.com"
                }`}
                className="block hover:text-[#CDB52B] transition wrap-break-word"
              >
                ✉️ {companyInfo.email || "contact@aranyakventures.com"}
              </a>

              <p>🕒 {companyInfo.workingHours || "Monday - Saturday"}</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col lg:flex-row justify-between gap-4 text-white/45 text-sm">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <p>
              © {currentYear} {companyInfo.name || "Aranyak Ventures"}. All
              rights reserved.
            </p>

            <div className="flex gap-3">
              <Link
                to="/privacy-policy"
                className="hover:text-[#CDB52B] transition"
              >
                Privacy
              </Link>

              <span>|</span>

              <Link
                to="/terms-and-conditions"
                className="hover:text-[#CDB52B] transition"
              >
                Terms
              </Link>
            </div>
          </div>

          <p>
            Designed & Developed by{" "}
            <span className="text-[#CDB52B] font-semibold">RKN Devl</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;