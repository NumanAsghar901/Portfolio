import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Interests from './components/Interests';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import FloatingShapes from './components/FloatingShapes';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <ScrollProgress />
      <FloatingShapes />
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-grow relative z-10">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Interests />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
