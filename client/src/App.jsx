import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import WhatsAppButton from "./components/common/WhatsAppButton";
import AIChatBot from "./components/common/AIChatBot";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -30,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>

      {!isAdminPage && <Footer />}

      {!isAdminPage && <WhatsAppButton />}
      {!isAdminPage && <AIChatBot />}
    </>
  );
}

export default App;