import React from 'react';
import { motion } from 'motion/react';
import { Download, User, Mail, MapPin, Briefcase } from 'lucide-react';
import { personalInfo } from '../data';

export default function AboutMe() {
  return (
    <section id="about" className="py-20 bg-transparent border-t border-zinc-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side - Text */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs">ABOUT ME</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Engineering With <span className="text-yellow-500">Passion</span> <br />
            While Exploring AI & Web.
          </h2>
          
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            I'm Numan Asghar, a Full Stack Developer & AI Specialist based in Faisalabad. I have a passion for creating scalable web applications and intelligent automation workflows.
          </p>

          <div className="pt-2">
            <span className="font-script text-4xl text-yellow-500 block mb-6">
              Numan Asghar
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
        <div className="flex flex-col space-y-8">
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800/50 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><User size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Name:</p>
                <p className="text-zinc-200 font-medium text-sm">{personalInfo.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><Mail size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Email:</p>
                <p className="text-zinc-200 font-medium text-sm truncate max-w-[150px]" title={personalInfo.email}>
                  {personalInfo.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><MapPin size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">From:</p>
                <p className="text-zinc-200 font-medium text-sm">Faisalabad, PK</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-yellow-500"><Briefcase size={20} /></div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Availability:</p>
                <p className="text-zinc-200 font-medium text-sm">Open to Work</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">02+</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Years Exp.</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">10+</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Projects</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">90+</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Students</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-3xl font-bold text-white mb-1">03+</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider">Awards</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
