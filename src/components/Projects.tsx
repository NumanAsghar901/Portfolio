import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Layers, Search, Code, Cpu, BrainCircuit } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';

export default function Projects() {
  const { projectsData } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ml' | 'ai'>('all');

  const filterTabs = [
    { id: 'all', name: 'All Projects', icon: Layers },
    { id: 'web', name: 'MERN & Web', icon: Code },
    { id: 'ml', name: 'ML & Data Science', icon: BrainCircuit },
    { id: 'ai', name: 'AI & Automation', icon: Cpu },
  ] as const;

  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.category === activeFilter;
  });

  return (
    <section
      id="projects"
      className="py-12 sm:py-16 bg-[#151c28] border-y border-zinc-700/60 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Visual background details */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-yellow-500/[0.03] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/[0.02] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8" id="projects-header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase mb-2"
          >
            <Layers className="w-3.5 h-3.5" />
            Showcase
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100"
          >
            Featured Engineering Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mt-3 leading-relaxed"
          >
            A curated selection of academic, personal, and full-stack implementations designed for real-world operations and predictive accuracy.
          </motion.p>
        </div>

        {/* Filter Navigation Menu */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8" id="project-filters">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border focus:outline-none ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-transparent shadow-yellow-500/20 scale-[1.02]'
                    : 'bg-[#0d121c] border-zinc-700/60 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50'
                }`}
                id={`filter-${tab.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with layout transitions */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          id="project-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full rounded-2xl bg-[#0d121c] border border-zinc-700/60 hover:border-yellow-500/40 shadow-xl transition-all duration-300 relative overflow-hidden project-card-3d"
              >
                {/* Visual Accent Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                {/* Top Half: Project Image Preview */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900/60 text-zinc-600">
                      <Layers className="w-10 h-10" />
                    </div>
                  )}

                  {/* Dark gradient overlay at bottom of image for seamless blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-black/30 pointer-events-none" />

                  {/* Category Pill Tag floating on top left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-yellow-400 bg-zinc-950/85 backdrop-blur-md border border-yellow-500/30 px-2.5 py-1 rounded-md shadow-lg inline-block">
                      {project.category === 'web'
                        ? 'MERN & WEB DEV'
                        : project.category === 'ml'
                        ? 'MACHINE LEARNING'
                        : 'AI & AUTOMATION'}
                    </span>
                  </div>

                  {/* Action Links floating on top right */}
                  <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-yellow-500/50 hover:bg-zinc-900 transition-all shadow-lg"
                        title="GitHub Source"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-yellow-500/50 hover:bg-zinc-900 transition-all shadow-lg"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bottom Half: Project Information */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  {/* Title & Subtitle */}
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-100 group-hover:text-yellow-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-400 mt-1">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-zinc-300 text-sm mt-3 leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Technology Badging */}
                  <div className="flex flex-wrap gap-1.5 mt-5 pt-3 border-t border-zinc-800/80">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-sans text-[11px] font-medium bg-zinc-800/80 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
