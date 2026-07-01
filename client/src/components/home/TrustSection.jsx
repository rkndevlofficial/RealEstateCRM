import { motion } from "framer-motion";

function TrustSection() {
  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-yellow-500 font-semibold mb-3 tracking-[0.2em] uppercase">
            Why Choose Aranyak Ventures
          </p>

          <h2 className="text-5xl font-extrabold text-slate-950">
            Trusted Real Estate Partner
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            We help families and investors find the perfect
            property with complete transparency and expert guidance.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{
            staggerChildren: 0.15,
          }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "🏠",
              title: "Verified Properties",
              desc: "Every property is verified with complete project details and documentation.",
            },
            {
              icon: "📍",
              title: "Prime Locations",
              desc: "Carefully selected residential and commercial projects in top locations.",
            },
            {
              icon: "🤝",
              title: "Trusted Support",
              desc: "Dedicated assistance from inquiry to property possession.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardAnimation}
              transition={{ duration: 0.7 }}
              whileHover={{
                y: -12,
                scale: 1.03,
              }}
              className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-linear-to-br from-yellow-100/40 to-transparent"></div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    rotate: 10,
                    scale: 1.1,
                  }}
                  className="text-5xl mb-5"
                >
                  {item.icon}
                </motion.div>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-4">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 70,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
          }}
          whileHover={{
            scale: 1.02,
          }}
          className="mt-20 bg-slate-950 text-white rounded-3xl p-12 text-center shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.15),transparent_60%)]"></div>

          <div className="relative z-10">
            <p className="text-3xl italic max-w-4xl mx-auto leading-relaxed">
              "Aranyak Ventures helped us find our dream home.
              The entire process was smooth, transparent,
              and professional."
            </p>

            <div className="mt-8">
              <h4 className="font-bold text-yellow-400 text-xl">
                Rahul Sharma
              </h4>

              <p className="text-slate-400 mt-2">
                Happy Home Buyer
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default TrustSection;