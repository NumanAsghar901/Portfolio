import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0f15]/90 backdrop-blur-md shadow-lg border-b border-zinc-800/50 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#home"
          className="flex items-center group focus:outline-none"
          id="logo"
        >
          <span className="font-script text-4xl text-yellow-500 hover:text-yellow-400 transition-colors">
            Numan
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveTab(item.name)}
              className="relative text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 group flex flex-col items-center"
            >
              <span className={`w-1 h-1 rounded-full bg-yellow-500 mb-1 transition-opacity ${activeTab === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Controls (Contact CTA) */}
        <div className="hidden md:flex items-center space-x-4" id="header-actions">
          <a
            href="#contact"
            className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
            id="cta-hire-me"
          >
            <span>Hire Me</span>
            <ArrowUpRight size={16} strokeWidth={3} />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-yellow-400 transition-colors"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0b1215] border-b border-zinc-900"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                     setActiveTab(item.name);
                     setIsMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${activeTab === item.name ? 'text-yellow-500' : 'text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400'}`}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-zinc-900 flex justify-center">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-6 py-2.5 w-full bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
                >
                  <span>Hire Me</span>
                  <ArrowUpRight size={16} strokeWidth={3} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
