import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { personalInfo } from '../data';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/50 py-12 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between space-y-8 md:space-y-0 md:flex-row">
        {/* Left Side: Logo Brand and short copyright */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left" id="footer-brand">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-650 flex items-center justify-center text-white">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <span className="font-sans font-bold text-zinc-900 dark:text-zinc-100">
              Numan Asghar
            </span>
          </div>
          <p className="font-sans text-xs text-zinc-500 dark:text-zinc-500 font-medium mt-1">
            © {new Date().getFullYear()} Muhammad Numan Asghar. All rights reserved.
          </p>
        </div>

        {/* Center Side: Social profiles */}
        <div className="flex items-center space-x-5" id="footer-socials">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 border border-zinc-200/20 dark:border-zinc-850/40"
            title="GitHub Portfolio"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 border border-zinc-200/20 dark:border-zinc-850/40"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 border border-zinc-200/20 dark:border-zinc-850/40"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Right Side: Back to top button */}
        <div id="footer-back-to-top">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200 border border-zinc-200/20 dark:border-zinc-850/40 cursor-pointer"
            title="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
