import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { skillsData } from '../data';
import { Skill } from '../types';

export default function Skills() {
  // Safe icon helper that falls back to code icon if missing
  const getIcon = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
    return <LucideIcons.Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <section
      id="skills"
      className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-400/5 dark:bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" id="skills-header">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-xs font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2"
          >
            Technical Stack & Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed"
          >
            Developing and optimizing pipelines across web systems, machine learning pipelines, and robust AI automation models.
          </motion.p>
        </div>

        {/* Skill Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="skills-grid">
          {skillsData.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-zinc-200/50 dark:border-zinc-900/80 bg-zinc-50/40 dark:bg-zinc-900/20 p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/10 transition-all duration-300"
            >
              {/* Category Title */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/80 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-200/20 dark:border-indigo-800/20">
                  {getIcon(category.iconName)}
                </div>
                <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {category.title}
                </h3>
              </div>

              {/* Individual Skills or Tags */}
              <div className="space-y-4">
                {category.skills.map((skill, sIdx) => {
                  const isSkillObject = typeof skill !== 'string';
                  const skillName = isSkillObject ? (skill as Skill).name : (skill as string);
                  const skillLevel = isSkillObject ? (skill as Skill).level : 85;

                  return (
                    <div key={skillName} className="group">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-sans font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors duration-200">
                          {skillName}
                        </span>
                        {isSkillObject && (
                          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">
                            {skillLevel}%
                          </span>
                        )}
                      </div>

                      {/* Animated Skill Meter */}
                      {isSkillObject ? (
                        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skillLevel}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: sIdx * 0.05 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-550 rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block mr-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
