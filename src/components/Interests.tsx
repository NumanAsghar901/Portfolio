import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { interestsData } from '../data';

export default function Interests() {
  const getIcon = (name: string) => {
    const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6" />;
    }
    return <LucideIcons.Heart className="w-6 h-6" />;
  };

  return (
    <section
      id="interests"
      className="py-12 sm:py-16 bg-[#151c28] border-y border-zinc-700/60 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase mb-2"
          >
            <LucideIcons.Heart className="w-3.5 h-3.5 text-yellow-400" />
            Passions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100"
          >
            Areas of Interest
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 mt-3 leading-relaxed"
          >
            Domains I am actively exploring and building toward in my career.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {interestsData.map((interest, index) => (
            <motion.div
              key={interest.title}
              initial={{ opacity: 0, y: 30, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, rotateY: 5, rotateX: -5 }}
              className="interest-card group rounded-2xl border border-zinc-700/60 bg-[#0d121c] p-7 text-center shadow-xl hover:border-yellow-500/40 hover:shadow-yellow-500/10 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/25 group-hover:scale-110 transition-transform duration-300">
                {getIcon(interest.iconName)}
              </div>
              <h3 className="font-bold text-lg text-zinc-100 mt-6 group-hover:text-yellow-500 group-hover:text-yellow-400 transition-colors">
                {interest.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                {interest.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
