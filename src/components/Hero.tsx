import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { personalInfo } from '../data';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xOffset = x / rect.width - 0.5;
    const yOffset = y / rect.height - 0.5;
    setRotateY(xOffset * 18);
    setRotateX(-yOffset * 18);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = 55;
    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      z: number;
    }> = [];

    const colors = [
      'rgba(99, 102, 241, 0.4)',
      'rgba(16, 185, 129, 0.35)',
      'rgba(139, 92, 246, 0.3)',
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        z: Math.random(),
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleCanvasMouseMove);

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        const size = p1.radius * (0.5 + p1.z * 0.8);
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 140) * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouseX && mouseY) {
          const mouseDist = Math.hypot(p1.x - mouseX, p1.y - mouseY);
          if (mouseDist < 220) {
            const force = (220 - mouseDist) / 2500;
            p1.vx += (mouseX - p1.x) * force * 0.04;
            p1.vy += (mouseY - p1.y) * force * 0.04;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, []);

  const stats = [
    { value: '10+', label: 'Projects Built' },
    { value: '90+', label: 'Students Assisted' },
    { value: '98%', label: 'On-Time Grading' },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider w-fit border border-indigo-200/50 dark:border-indigo-900/40"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Open To Opportunities</span>
          </motion.div>

          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-indigo-600 dark:text-indigo-400 text-sm sm:text-base font-semibold tracking-widest uppercase"
            >
              Hi, my name is
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none"
            >
              <span className="gradient-text">{personalInfo.name}</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-zinc-500 dark:text-zinc-400 mt-2"
            >
              {personalInfo.title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed"
          >
            {personalInfo.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#projects"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 px-6 py-3 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Me</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 pt-6 max-w-lg border-t border-zinc-200/50 dark:border-zinc-900/50"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-500 dark:text-indigo-400">
                  {stat.value}
                </p>
                <p className="text-xs font-sans tracking-wide text-zinc-500 dark:text-zinc-400 uppercase mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-sm relative group"
            style={{ perspective: '1200px' }}
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 opacity-25 group-hover:opacity-50 blur-2xl transition-opacity duration-500 animate-gradient-shift" />

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-2xl bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/50 dark:border-zinc-800/80 p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center select-none"
              style={{
                transform: isHovered
                  ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
                  : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                boxShadow: isHovered
                  ? '0 30px 60px -15px rgba(99, 102, 241, 0.25)'
                  : '0 20px 40px -10px rgba(0,0,0,0.1)',
                transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-full flex items-center justify-between mb-5">
                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-200/40 dark:border-zinc-800/40">
                  EST. 2023
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                    Available
                  </span>
                </span>
              </div>

              <div
                className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-2xl overflow-hidden mb-6 border-2 border-zinc-100 dark:border-zinc-800 shadow-inner group-hover:border-indigo-500/50 transition-colors duration-300"
                style={{ transform: 'translateZ(40px)' }}
              >
                <img
                  src={personalInfo.portraitUrl}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top grayscale-[30%] brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400/60 opacity-0 group-hover:opacity-100 group-hover:top-full transition-all duration-[2000ms] ease-linear pointer-events-none" />
              </div>

              <div className="text-center w-full" style={{ transform: 'translateZ(20px)' }}>
                <h3 className="font-sans font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {personalInfo.name}
                </h3>
                <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                  Computer Science @ FAST-NUCES
                </p>
                <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 mt-2 italic px-2">
                Engineering intelligent web applications, AI systems, and automated workflows for businesses and startups.
                </p>
              </div>

              <div
                className="flex items-center space-x-4 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900 w-full justify-center"
                style={{ transform: 'translateZ(30px)' }}
              >
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:scale-110 transition-all duration-200"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:scale-110 transition-all duration-200"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:scale-110 transition-all duration-200"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
