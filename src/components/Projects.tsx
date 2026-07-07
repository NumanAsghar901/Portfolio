import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Layers, Search, Code, Cpu, BrainCircuit } from 'lucide-react';
import { projectsData } from '../data';
import { Project } from '../types';

export default function Projects() {
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
      className="py-20 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Visual background details */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12" id="projects-header">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase"
          >
            Showcase
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2"
          >
            Featured Engineering Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed"
          >
            A curated selection of academic, personal, and full-stack implementations designed for real-world operations and predictive accuracy.
          </motion.p>
        </div>

        {/* Filter Navigation Menu */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12" id="project-filters">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border focus:outline-none ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-650 text-white border-transparent shadow-md shadow-indigo-550/20 scale-[1.02]'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-350 hover:border-zinc-350 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          id="project-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="group flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 shadow-md shadow-zinc-100 dark:shadow-none hover:shadow-xl transition-all duration-300 relative overflow-hidden project-card-3d"
              >
                {/* Visual Accent Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-450 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category Pill Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded-md">
                      {project.category === 'web'
                        ? 'MERN & WEB DEV'
                        : project.category === 'ml'
                        ? 'MACHINE LEARNING'
                        : 'AI & AUTOMATION'}
                    </span>
                    <div className="flex items-center space-x-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
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
                          className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-sans font-bold text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-zinc-600 dark:text-zinc-350 text-sm mt-3 leading-relaxed flex-grow">
                    {project.description}
                  </p>

                  {/* Key bullet outcomes */}
                  <ul className="mt-4 space-y-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mb-4">
                    {project.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start space-x-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technology badging */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-sans text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-200/40 dark:border-zinc-700/40"
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
