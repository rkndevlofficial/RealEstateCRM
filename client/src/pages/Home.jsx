import { motion } from "framer-motion";

import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturedProjects from "../components/home/FeaturedProjects";
import TrustSection from "../components/home/TrustSection";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <StatsSection />
      </motion.div>

      <FeaturedProjects />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <TrustSection />
      </motion.div>
    </motion.div>
  );
}

export default Home;