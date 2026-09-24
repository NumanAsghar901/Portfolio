import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Hero() {
  const { personalInfo, downloadCv } = usePortfolio();

  return (
    <section
      id="home"
      className="relative flex flex-col justify-between pt-28 pb-0 sm:pt-32 lg:pt-36 overflow-hidden bg-[#0c0f15]"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">
        {/* Left Column - Text Content */}
        <div className="flex flex-col space-y-6 text-left z-10 pt-4 pb-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-yellow-500 font-semibold text-sm sm:text-base mb-3 flex items-center">
              {personalInfo.heroGreeting || `Hello, I'm ${personalInfo.name} 👋`}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.8rem] font-bold tracking-tight text-white leading-tight">
              {personalInfo.heroHeadlinePrefix || 'I DESIGN & BUILD'}
              <br />
              <span className="text-yellow-500 whitespace-nowrap">
                {personalInfo.heroHeadlineHighlight || 'DIGITAL EXPERIENCES'}
              </span>
            </h1>
            {personalInfo.title && (
              <p className="text-zinc-300 font-mono text-xs sm:text-sm mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{personalInfo.title}</span>
              </p>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg"
          >
            {personalInfo.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            {/* Download CV button triggers real PDF download */}
            <button
              onClick={() => downloadCv()}
              className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors cursor-pointer shadow-lg shadow-yellow-500/20"
              title="Download real Curriculum Vitae (PDF)"
              id="hero-download-cv"
            >
              <span>Download CV</span>
              <Download size={16} strokeWidth={2.5} />
            </button>
            <a
              href="#projects"
              className="flex items-center space-x-2 px-6 py-3 border border-zinc-700 text-white font-semibold text-sm rounded hover:border-yellow-500 hover:text-yellow-500 transition-colors"
            >
              <span>View Works</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6"
          >
            <p className="text-sm text-zinc-300 font-medium">Follow Me :</p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                title="GitHub"
              >
                <Github size={18} strokeWidth={2.5} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                title="LinkedIn"
              >
                <Linkedin size={18} strokeWidth={2.5} />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                title={personalInfo.email}
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <Mail size={18} strokeWidth={2.5} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Image & Graphics */}
        <div className="relative flex justify-center lg:justify-start lg:-ml-12 items-end self-end w-full">
          {/* Portrait Image (Grounded to section bottom) */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            src={personalInfo.portraitUrl}
            alt={personalInfo.name}
            className="relative z-10 w-full max-w-[500px] sm:max-w-[580px] md:max-w-[640px] lg:max-w-[780px] xl:max-w-[850px] object-contain drop-shadow-2xl lg:-ml-8 block -mb-1"
          />
        </div>
      </div>
    </section>
  );
}
