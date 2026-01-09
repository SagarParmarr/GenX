"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] pt-20">
      {/* Animated background elements */}
      <motion.div className="absolute top-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" animate={{ y: [0, 40, 0] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" animate={{ y: [0, -40, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 0.5 }} />

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <div className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
              <p className="text-xs font-medium text-white/70 tracking-widest uppercase">The Future of Sound</p>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">Redefine</span>
            <br />
            <span className="bg-gradient-to-r from-white/50 via-white to-white/40 bg-clip-text text-transparent">Your Sound</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
            GenX headphones aren't just audio devices. They're a gateway to experiencing music the way it was meant to be heard—with precision, depth, and soul.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-[#050505] rounded-lg font-semibold text-base hover:bg-white/90 transition-colors duration-300 shadow-lg shadow-white/20">
              Pre-Order Now
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 border border-white/30 text-white rounded-lg font-semibold text-base hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
              Explore Experience
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left">
            {[
              { number: "48h", label: "Battery Life" },
              { number: "10ms", label: "Ultra-Low Latency" },
              { number: "24-bit", label: "Hi-Res Audio" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-sm text-white/50 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <svg className="w-6 h-6 text-white/30" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
}
