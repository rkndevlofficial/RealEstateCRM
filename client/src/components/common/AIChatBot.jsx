import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "../../config/api";
import companyInfo from "../../data/companyInfo";
import {
  validateLeadForm,
  isValidEmail,
  isValidIndianPhone,
} from "../../utils/validators";

function AIChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Hello 👋 Welcome to ${
        companyInfo.name || "Aranyak Ventures"
      }. I am your property assistant. How can I help you?`,
    },
  ]);

  const [leadMode, setLeadMode] = useState(false);
  const [leadStep, setLeadStep] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [leadData, setLeadData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    projectName: "AI Chatbot Inquiry",
  });

  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);

  const whatsappNumber = String(
    companyInfo.whatsapp || companyInfo.phone || "919209774755"
  ).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello ${
      companyInfo.name || "Aranyak Ventures"
    }, I am interested in your property projects. Please share more details.`
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, open]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { from: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
  };

  const cleanPhoneNumber = (phone) => {
    const digits = String(phone || "").replace(/\D/g, "");

    if (digits.length === 10) {
      return digits;
    }

    if (digits.length === 12 && digits.startsWith("91")) {
      return digits.slice(2);
    }

    return digits;
  };

  const getValidationStep = (errorMessage) => {
    const message = errorMessage.toLowerCase();

    if (message.includes("name")) return "name";
    if (message.includes("phone")) return "phone";
    if (message.includes("email")) return "email";

    return "message";
  };

  const startLeadFlow = (type) => {
    setLeadMode(true);
    setLeadStep("name");
    setInput("");

    setLeadData({
      name: "",
      phone: "",
      email: "",
      message: type,
      projectName: "AI Chatbot Inquiry",
    });

    addBotMessage(
      `Sure ✅ I can help you with ${type}. Please share your full name.`
    );
  };

  const handleQuickAction = (action) => {
    addUserMessage(action.label);

    if (action.type === "projects") {
      addBotMessage(
        "You can explore all available and upcoming projects on the Projects page. Click any project to view price, gallery, unit types, brochure, and location details."
      );
      return;
    }

    if (action.type === "siteVisit") {
      startLeadFlow("Site Visit Request");
      return;
    }

    if (action.type === "price") {
      startLeadFlow("Price Inquiry");
      return;
    }

    if (action.type === "location") {
      addBotMessage(
        `Our office address is: ${
          companyInfo.address || "Thane West, Maharashtra"
        }. You can also check the map on the Contact page.`
      );
      return;
    }

    if (action.type === "contact") {
      addBotMessage(
        `You can call us at ${
          companyInfo.phone || "+91 22 3186 4682"
        } or message us directly on WhatsApp.`
      );
      return;
    }

    if (action.type === "lead") {
      startLeadFlow("General Inquiry");
    }
  };

  const submitLead = async (finalLeadData) => {
    const validationError = validateLeadForm(finalLeadData);

    if (validationError) {
      addBotMessage(validationError);
      setLeadStep(getValidationStep(validationError));
      return;
    }

    try {
      setSubmitting(true);

      await API.post("/leads", {
        name: finalLeadData.name.trim(),
        phone: finalLeadData.phone.trim(),
        email: finalLeadData.email.trim(),
        message: finalLeadData.message.trim(),
        projectName: finalLeadData.projectName,
      });

      addBotMessage(
        "Thank you ✅ Your inquiry has been submitted. Our team will contact you shortly."
      );

      setLeadMode(false);
      setLeadStep("");

      setLeadData({
        name: "",
        phone: "",
        email: "",
        message: "",
        projectName: "AI Chatbot Inquiry",
      });
    } catch (error) {
      console.log("Chatbot lead error:", error);
      addBotMessage("Something went wrong ❌ Please try again or use WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeadInput = async (value) => {
    const trimmedValue = value.trim();

    if (leadStep === "name") {
      if (trimmedValue.length < 2) {
        addBotMessage("Please enter a valid name with at least 2 characters.");
        return;
      }

      if (!/^[a-zA-Z\s.]+$/.test(trimmedValue)) {
        addBotMessage("Please enter a valid name. Numbers are not allowed.");
        return;
      }

      const updatedData = {
        ...leadData,
        name: trimmedValue,
      };

      setLeadData(updatedData);
      setLeadStep("phone");
      addBotMessage("Great 👍 Please share your 10 digit mobile number.");
      return;
    }

    if (leadStep === "phone") {
      const cleanedPhone = cleanPhoneNumber(trimmedValue);

      if (!isValidIndianPhone(cleanedPhone)) {
        addBotMessage(
          "Please enter a valid 10 digit Indian mobile number. Example: 9876543210"
        );
        return;
      }

      const updatedData = {
        ...leadData,
        phone: cleanedPhone,
      };

      setLeadData(updatedData);
      setLeadStep("email");
      addBotMessage("Thanks. Please share your email address, or type Skip.");
      return;
    }

    if (leadStep === "email") {
      const emailValue = trimmedValue.toLowerCase() === "skip" ? "" : trimmedValue;

      if (emailValue && !isValidEmail(emailValue)) {
        addBotMessage(
          "Please enter a valid email address. Example: name@example.com or type Skip."
        );
        return;
      }

      const updatedData = {
        ...leadData,
        email: emailValue,
      };

      setLeadData(updatedData);
      setLeadStep("message");
      addBotMessage(
        "Last step ✅ Please write your requirement. Example: 2 BHK in Thane, budget 50 lakh."
      );
      return;
    }

    if (leadStep === "message") {
      if (trimmedValue.length < 5) {
        addBotMessage(
          "Please write a little more detail about your requirement."
        );
        return;
      }

      const updatedData = {
        ...leadData,
        message: `${leadData.message} - ${trimmedValue}`.slice(0, 500),
      };

      setLeadData(updatedData);
      await submitLead(updatedData);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const value = input.trim();

    if (!value || submitting) return;

    addUserMessage(value);
    setInput("");

    if (leadMode) {
      await handleLeadInput(value);
      return;
    }

    const lowerValue = value.toLowerCase();

    if (
      lowerValue.includes("price") ||
      lowerValue.includes("cost") ||
      lowerValue.includes("budget")
    ) {
      startLeadFlow("Price Inquiry");
      return;
    }

    if (
      lowerValue.includes("visit") ||
      lowerValue.includes("site") ||
      lowerValue.includes("booking")
    ) {
      startLeadFlow("Site Visit Request");
      return;
    }

    if (
      lowerValue.includes("contact") ||
      lowerValue.includes("call") ||
      lowerValue.includes("phone")
    ) {
      addBotMessage(
        `You can call us at ${
          companyInfo.phone || "+91 22 3186 4682"
        } or use the WhatsApp button below.`
      );
      return;
    }

    if (
      lowerValue.includes("location") ||
      lowerValue.includes("address") ||
      lowerValue.includes("office")
    ) {
      addBotMessage(
        `Our office address is: ${
          companyInfo.address || "Thane West, Maharashtra"
        }.`
      );
      return;
    }

    if (
      lowerValue.includes("project") ||
      lowerValue.includes("flat") ||
      lowerValue.includes("property") ||
      lowerValue.includes("bhk")
    ) {
      addBotMessage(
        "We have multiple property projects listed on the Projects page. You can view project details, price, gallery, brochure, and inquiry form there."
      );
      return;
    }

    addBotMessage(
      "I can help you with projects, pricing, site visits, location, and contact details. You can also share your requirement and our team will call you."
    );
  };

  const quickActions = [
    { label: "🏠 Projects", type: "projects" },
    { label: "📅 Site Visit", type: "siteVisit" },
    { label: "💰 Price", type: "price" },
    { label: "📍 Location", type: "location" },
    { label: "📞 Contact", type: "contact" },
    { label: "📝 Inquiry", type: "lead" },
  ];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{
          scale: 1.06,
          y: -3,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="fixed bottom-24 right-5 sm:bottom-24 sm:right-6 z-60 w-14 h-14 rounded-full bg-[#35434A] hover:bg-[#CDB52B] text-white hover:text-[#263238] shadow-2xl border border-white/20 flex items-center justify-center text-2xl transition"
        aria-label="Open AI Chatbot"
      >
        {open ? "×" : "🤖"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            transition={{
              duration: 0.22,
            }}
            className="fixed right-3 sm:right-6 bottom-40 sm:bottom-40 z-55 w-[calc(100vw-24px)] sm:w-360px max-w-360px max-h-[calc(100svh-190px)] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            <div className="bg-linear-to-r from-[#35434A] to-[#263238] text-white p-3.5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#CDB52B] text-[#263238] flex items-center justify-center text-xl">
                  🤖
                </div>

                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm">
                    Aranyak Assistant
                  </h3>

                  <p className="text-xs text-white/65">
                    Online property assistant
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-55 overflow-y-auto p-3 bg-[#F7F6EF]">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed wrap-break-word ${
                        message.from === "user"
                          ? "bg-[#35434A] text-white rounded-br-md"
                          : "bg-white text-[#263238] border border-slate-100 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {submitting && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-500 border border-slate-100 px-3.5 py-2.5 rounded-2xl text-sm">
                      Submitting inquiry...
                    </div>
                  </div>
                )}

                <div ref={chatEndRef}></div>
              </div>
            </div>

            {!leadMode && (
              <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.type}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      className="shrink-0 bg-[#F7F6EF] hover:bg-[#CDB52B]/20 text-[#263238] border border-[#CDB52B]/20 px-3 py-2 rounded-full text-xs font-bold transition"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="p-2.5 bg-white border-t border-slate-100 flex gap-2 shrink-0"
            >
              <input
                type={leadStep === "phone" ? "tel" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  leadMode
                    ? leadStep === "phone"
                      ? "Enter 10 digit mobile..."
                      : leadStep === "email"
                      ? "Email or type Skip..."
                      : leadStep === "message"
                      ? "Write your requirement..."
                      : "Type your answer..."
                    : "Ask about projects, price, visit..."
                }
                className="min-w-0 flex-1 border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#CDB52B] text-sm"
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#CDB52B] hover:bg-[#9CA83A] disabled:bg-slate-300 text-[#263238] px-4 py-3 rounded-xl font-extrabold transition text-sm"
              >
                Send
              </button>
            </form>

            <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-[#9CA83A] hover:bg-[#CDB52B] text-white hover:text-[#263238] py-3 rounded-xl font-extrabold transition text-sm"
              >
                Continue on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChatBot;