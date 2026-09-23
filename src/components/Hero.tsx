import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '../data';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Text Content */}
        <div className="flex flex-col space-y-6 text-left z-10 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-yellow-500 font-semibold text-sm sm:text-base mb-3 flex items-center">
              Hello, I'm Numan Asghar <span className="ml-2 text-xl">👋</span>
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.2rem] xl:text-[2.8rem] font-bold tracking-tight text-white leading-tight">
              I DESIGN & BUILD <span className="text-yellow-500 whitespace-nowrap">DIGITAL EXPERIENCES</span>
            </h1>
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
            <a
              href="#contact"
              className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
            >
              <span>Download CV</span>
              <Download size={16} strokeWidth={2.5} />
            </a>
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
            className="pt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6"
          >
            <p className="text-sm text-zinc-300 font-medium">Follow Me :</p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <Github size={18} strokeWidth={2.5} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <Linkedin size={18} strokeWidth={2.5} />
              </a>
              <a
                href={`mailto:numanasghar901@gmail.com`}
                title="numanasghar901@gmail.com"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <Mail size={18} strokeWidth={2.5} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Image & Graphics */}
        <div className="relative flex justify-center lg:justify-start lg:-ml-12 items-center h-full min-h-[400px] sm:min-h-[500px] mt-10 lg:mt-0">
          
          {/* Portrait Image (Perfectly matches background #101318) */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            src={personalInfo.portraitUrl}
            alt={personalInfo.name}
            className="relative z-10 w-full max-w-[500px] lg:max-w-[700px] object-contain drop-shadow-2xl lg:-ml-8"
          />
        </div>
      </div>
    </section>
  );
}
