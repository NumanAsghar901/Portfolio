import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Award, Calendar, ChevronRight, ExternalLink } from 'lucide-react';
import { experienceData, educationData, achievementsData } from '../data';

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-12 sm:py-16 bg-[#0c0f15] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10" id="experience-header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase mb-2"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100"
          >
            Experience & Education
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mt-3 leading-relaxed"
          >
            A timeline of software engineering, academic leadership, and full-stack development experience.
          </motion.p>
        </div>

        {/* Timeline Grid (2 Columns: Left is Work/Education, Right is Achievements) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="timeline-grid">
          {/* Left Column: Work & Education */}
          <div className="lg:col-span-7 space-y-12" id="left-timeline">
            {/* Professional Experience Segment */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-yellow-100/80 bg-yellow-950/40 flex items-center justify-center text-yellow-650 text-yellow-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-extrabold text-xl text-zinc-100">
                  Professional Experience
                </h3>
              </div>

              <div className="border-l-2 border-zinc-850 pl-6 space-y-8 relative">
                {experienceData.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Circle Node */}
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white border-zinc-950 " />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-sans font-bold text-base sm:text-lg text-zinc-100 group-hover:text-yellow-500">
                        {exp.role}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-yellow-400 bg-yellow-950/30 border border-yellow-800/30 px-2 py-0.5 rounded-md mt-1 sm:mt-0 w-fit">
                        {exp.period}
                      </span>
                    </div>

                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 font-mono text-xs text-yellow-500 hover:text-yellow-400 font-semibold mt-1 transition-colors group/link w-fit underline decoration-yellow-500/40 hover:decoration-yellow-400"
                      >
                        <span>{exp.company}</span>
                        <ExternalLink size={12} className="inline group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <p className="font-mono text-xs text-zinc-400 mt-1 font-medium">
                        {exp.company}
                      </p>
                    )}

                    <ul className="mt-3 space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-sm text-zinc-350 leading-relaxed flex items-start space-x-2">
                          <ChevronRight className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education Segment */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 bg-emerald-950/40 flex items-center justify-center text-emerald-650 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-extrabold text-xl text-zinc-100">
                  Formal Education
                </h3>
              </div>

              <div className="border-l-2 border-zinc-850 pl-6 space-y-8 relative">
                {educationData.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative"
                  >
                    {/* Circle Node */}
                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-550 border-4 border-white border-zinc-950 " />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-sans font-bold text-base sm:text-lg text-zinc-100">
                        {edu.degree}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-emerald-600 text-emerald-405 bg-emerald-50 bg-emerald-950/30 px-2 py-0.5 rounded-md mt-1 sm:mt-0 w-fit">
                        {edu.period}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-zinc-400 mt-1 font-semibold uppercase tracking-wide">
                      {edu.institution}
                    </p>

                    <div className="mt-2.5 flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-sans text-sm font-medium text-emerald-600 text-emerald-400">
                        Currently Enrolled
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Certifications */}
          <div className="lg:col-span-5 space-y-6" id="right-timeline">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-yellow-100/80 bg-yellow-950/40 flex items-center justify-center text-yellow-650 text-yellow-400">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-zinc-100">
                Honors & Recognition
              </h3>
            </div>

            <div className="space-y-6">
              {achievementsData.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-zinc-800/80 bg-[#131924] p-5 hover:border-yellow-500/30 transition-all duration-300 flex items-start space-x-4 group shadow-md"
                >
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans font-bold text-sm sm:text-base text-zinc-100 group-hover:text-yellow-500 group-hover:text-yellow-400 transition-colors">
                      {award.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
