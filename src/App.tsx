import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Interests from './components/Interests';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0c0f15] text-zinc-200 transition-colors duration-300 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-yellow-500 selection:text-black">
      


      <Header />

      <main className="flex-grow relative z-10">
        <Hero />
        <AboutMe />
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
