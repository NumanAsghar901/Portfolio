import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Footer() {
  const { personalInfo } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#0b0e13] border-t border-zinc-800/80 py-8 sm:py-10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between space-y-6 md:space-y-0 md:flex-row">
        {/* Left Side: Logo Brand and short copyright */}
        <div className="flex flex-col items-center md:items-start space-y-1.5 text-center md:text-left" id="footer-brand">
          <div className="flex items-center space-x-2">
            <span className="font-script text-3xl text-yellow-500 hover:text-yellow-400 transition-colors">
              Numan
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-sans text-xs text-zinc-500 font-medium">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </p>
            <span className="text-zinc-700">•</span>
            <a
              href="/admin"
              onClick={navigateToAdmin}
              className="inline-flex items-center space-x-1 text-xs text-zinc-600 hover:text-yellow-400 transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck size={12} />
              <span>Admin</span>
            </a>
          </div>
        </div>

        {/* Center Side: Social profiles */}
        <div className="flex items-center space-x-4" id="footer-socials">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400 transition-all duration-200 border border-zinc-800 hover:border-yellow-500/30 shadow-sm"
            title="GitHub Portfolio"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400 transition-all duration-200 border border-zinc-800 hover:border-yellow-500/30 shadow-sm"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400 transition-all duration-200 border border-zinc-800 hover:border-yellow-500/30 shadow-sm"
            title="Email"
          >
            <Mail className="w-4.5 h-4.5" />
          </a>
        </div>

        {/* Right Side: Back to top button */}
        <div id="footer-back-to-top">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-yellow-400 transition-all duration-200 border border-zinc-800 hover:border-yellow-500/30 cursor-pointer shadow-sm flex items-center gap-2 text-xs font-medium"
            title="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
