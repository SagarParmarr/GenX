"use client";

import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "experience", "specs", "design"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-hide navbar on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: "Experience", id: "experience" },
    { label: "Specs", id: "specs" },
    { label: "Design", id: "design" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5"
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-white/50 to-white origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">GenX</span>
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-all duration-300 relative ${
                activeSection === item.id ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div layoutId="activeSection" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </button>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block px-6 py-2.5 bg-white text-[#050505] rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors duration-300">
          Pre-Order
        </motion.button>

        {/* Mobile Menu Button */}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          <div className="w-6 h-5 flex flex-col justify-between">
            <motion.span animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-white block" />
            <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-full h-0.5 bg-white block" />
            <motion.span animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }} className="w-full h-0.5 bg-white block" />
          </div>
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <motion.div initial={false} animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden border-t border-white/5">
        <div className="px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-left transition-colors ${activeSection === item.id ? "text-white font-semibold" : "text-white/70 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
          <button className="w-full px-4 py-2 bg-white text-[#050505] rounded-lg font-semibold mt-2 hover:bg-white/90 transition-colors">
            Pre-Order
          </button>
        </div>
      </motion.div>
    </motion.header>
  );
}
