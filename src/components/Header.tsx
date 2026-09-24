import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Header() {
  const { personalInfo } = usePortfolio();
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    e.preventDefault();
    setActiveTab(name);
    setIsMobileMenuOpen(false);

    // If currently on /admin, navigate back to portfolio first
    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState({}, '', '/' + href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerHeight = 75;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
          window.history.pushState(null, '', href);
        } else if (targetId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          window.history.pushState(null, '', '#home');
        }
      }, 60);
    } else {
      window.location.href = href;
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0f15]/95 backdrop-blur-md shadow-lg border-b border-zinc-800/60 py-4'
          : 'bg-[#0c0f15]/80 backdrop-blur-sm py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'Home')}
          className="flex items-center group focus:outline-none cursor-pointer"
          id="logo"
        >
          <span className="font-script text-4xl text-yellow-500 hover:text-yellow-400 transition-colors">
            {personalInfo.name.split(' ')[1] || personalInfo.name.split(' ')[0] || 'Numan'}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.name)}
              className="relative text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 group flex flex-col items-center cursor-pointer"
            >
              <span
                className={`w-1 h-1 rounded-full bg-yellow-500 mb-1 transition-opacity ${
                  activeTab === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              />
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action Controls (Contact CTA) */}
        <div className="hidden md:flex items-center space-x-4" id="header-actions">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact', 'Contact')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors cursor-pointer"
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
            className="p-2.5 text-zinc-300 hover:text-yellow-400 transition-colors rounded-lg bg-zinc-900/80 border border-zinc-800"
            aria-label="Open menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-yellow-400" /> : <Menu className="w-6 h-6" />}
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
            className="md:hidden bg-[#0c1017] border-b border-zinc-800 shadow-2xl overflow-hidden"
            id="mobile-menu-drawer"
          >
            <div className="px-5 pt-3 pb-6 space-y-1.5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.name)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                    activeTab === item.name
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-zinc-800/80 flex justify-center">
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact', 'Contact')}
                  className="flex items-center justify-center space-x-2 px-6 py-3 w-full bg-yellow-500 text-black font-bold text-sm rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
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
