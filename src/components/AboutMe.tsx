import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Briefcase } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AboutMe() {
  const { personalInfo } = usePortfolio();

  const renderAboutHeadline = (text?: string) => {
    const rawText = text || 'Engineering With Passion While Exploring AI & Web.';
    const parts = rawText.split(/(passion)/i);
    return parts.map((part, index) =>
      part.toLowerCase() === 'passion' ? (
        <span key={index} className="text-yellow-500 font-bold">
          {part}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  return (
    <section id="about" className="py-12 sm:py-16 bg-[#151c28] border-y border-zinc-700/60 relative overflow-hidden">
      {/* Subtle ambient accent glow for section difference */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/[0.03] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/[0.02] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
        {/* Left Side - Text */}
        <div className="flex flex-col space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            ABOUT ME
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {renderAboutHeadline(personalInfo.aboutTitle)}
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            {personalInfo.aboutSubtitle ||
              "I'm Numan Asghar, a Full Stack Developer & AI Specialist based in Faisalabad. I have a passion for creating scalable web applications and intelligent automation workflows."}
          </p>

          <div className="pt-2">
            <span className="font-script text-4xl text-yellow-500 block mb-4">
              {personalInfo.name}
            </span>
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold text-sm rounded hover:bg-yellow-400 transition-colors"
            >
              <span>More About Me</span>
              <User size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>

        {/* Right Side - Grid & Stats */}
        <div className="flex flex-col space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-[#0d121c]/90 p-6 sm:p-7 rounded-xl border border-zinc-700/60 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><User size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Name:</p>
                <p className="text-zinc-200 font-medium text-sm">{personalInfo.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-yellow-500 shrink-0"><Mail size={20} /></div>
              <div className="min-w-0">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Email:</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-zinc-200 hover:text-yellow-400 font-medium text-xs sm:text-sm break-all transition-colors block"
                  title={personalInfo.email}
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><MapPin size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">From:</p>
                <p className="text-zinc-200 font-medium text-sm">{personalInfo.origin || 'Faisalabad, PK'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><Briefcase size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Availability:</p>
                <p className="text-zinc-200 font-medium text-sm">{personalInfo.availability || 'Open to Work'}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid - "90+ Students" removed as requested */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">{personalInfo.yearsExp || '02+'}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Years Exp.</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">{personalInfo.projectsCount || '10+'}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Projects</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">{personalInfo.awardsCount || '03+'}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Awards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
