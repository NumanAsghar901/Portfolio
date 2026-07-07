import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, Terminal, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Interests', href: '#interests' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-lg border-b border-zinc-200/50 dark:border-zinc-900/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#about"
          className="flex items-center space-x-2 group focus:outline-none"
          id="logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-150 leading-none">
              Numan Asghar
            </span>
            <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">
              AI & Web Dev
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-450 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action Controls (Theme, Github, Contact CTA) */}
        <div className="hidden md:flex items-center space-x-4" id="header-actions">
          {/* Available for Hire Status indicator from Elegant Dark */}
          <div className="flex items-center gap-2 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">Available for hire</span>
          </div>

          {/* GitHub Icon */}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
            title="GitHub Portfolio"
            id="github-link"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* LinkedIn Icon */}
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200"
            title="LinkedIn Profile"
            id="linkedin-link"
          >
            <Linkedin className="w-5 h-5" />
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-200"
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Hire Me CTA */}
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 rounded-lg hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] dark:hover:bg-blue-500 transition-all duration-200"
            id="cta-hire-me"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile menu and theme toggle controls */}
        <div className="flex items-center space-x-3 md:hidden">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
            aria-label="Toggle theme"
            id="mobile-theme-toggle"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
            id="mobile-menu-toggle"
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
            className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900"
            id="mobile-drawer"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-around">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-600 dark:text-zinc-400"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-600 dark:text-zinc-400"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="p-2 text-zinc-600 dark:text-zinc-400"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 rounded-lg"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
