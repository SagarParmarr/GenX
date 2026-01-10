"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const footerLinks = {
    Product: ["Features", "Specs", "Design", "Gallery"],
    Company: ["About", "Blog", "Press", "Careers"],
    Support: ["Help Center", "Contact", "Warranty", "Returns"],
    Legal: ["Privacy", "Terms", "Cookies", "Accessibility"],
  };

  return (
    <footer className="bg-[#050505] border-t border-white/5">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.svg" 
                alt="GenX Logo" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">GenX</span>
              </h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">Redefining the future of personal audio through precision engineering and uncompromising sound quality.</p>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-white/5 my-8 md:my-12" />

        {/* Bottom Footer */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p variants={itemVariants} className="text-sm text-white/50">
            © {currentYear} GenX Audio. All rights reserved.
          </motion.p>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-6">
            {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-sm text-white/50 hover:text-white transition-colors duration-300">
                {social}
              </a>
            ))}
          </motion.div>

          {/* Bottom Right CTA */}
          <motion.button variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors duration-300 backdrop-blur-sm">
            Subscribe to News
          </motion.button>
        </motion.div>
      </div>

      {/* Gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </footer>
  );
}
