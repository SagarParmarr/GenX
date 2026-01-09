"use client";

import { motion } from "framer-motion";
import { Music, Volume2, Radio, Headphones, Zap, Smartphone } from "lucide-react";

export default function Features() {
  const features = [
    {
      Icon: Music,
      title: "Titanium Drivers",
      description: "Rigid ultra-light diaphragms reveal hidden detail with unmatched clarity across the entire frequency spectrum.",
    },
    {
      Icon: Volume2,
      title: "Adaptive ANC",
      description: "Intelligent noise cancellation that learns your environment and adapts in real-time for perfect focus.",
    },
    {
      Icon: Radio,
      title: "24-bit Hi-Res",
      description: "Native support for studio-quality audio. Experience every transient exactly as the artist intended.",
    },
    {
      Icon: Headphones,
      title: "Precision Fit",
      description: "Ergonomic design crafted for all-day comfort. Personalized audio profile calibrated to your ear.",
    },
    {
      Icon: Zap,
      title: "48-Hour Battery",
      description: "Extended playback with rapid charging. Go weeks on a single week of usage.",
    },
    {
      Icon: Smartphone,
      title: "Multi-Device Sync",
      description: "Seamlessly switch between phone, laptop, and tablet with zero interruption.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="specs" className="py-24 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Engineered for Excellence</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">Every detail matters. From driver precision to battery endurance, GenX is built for discerning listeners.</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.Icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ transition: { duration: 0.2 } }}
                className="group p-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="mb-4 p-3 w-fit rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
