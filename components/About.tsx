import React from 'react';
import { Terminal, Database, Palette, Cpu } from 'lucide-react';
import { USER_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-black relative">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About Me.</h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            A fusion of technical expertise in CIS and creative frontend development. 
            I build systems that work as beautifully as they look.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Bio Card */}
          <div className="md:col-span-2 glass rounded-3xl p-8 flex flex-col justify-center min-h-[300px] border border-zinc-800 hover:border-zinc-600 transition-colors group">
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">Who I Am</h3>
            <p className="text-zinc-400 leading-relaxed text-lg">
              {USER_INFO.bio}
            </p>
          </div>

          {/* Stat/Visual Card */}
          <div className="glass rounded-3xl p-8 border border-zinc-800 flex flex-col items-center justify-center text-center hover:bg-zinc-900 transition-colors">
            <span className="text-6xl font-bold text-indigo-500 mb-2">{USER_INFO.age}</span>
            <span className="text-zinc-500 uppercase tracking-widest text-sm">Years Old</span>
          </div>

          {/* Skills Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <SkillCard icon={<Terminal className="w-6 h-6" />} title="Frontend" desc="React, TypeScript, Tailwind" />
            <SkillCard icon={<Database className="w-6 h-6" />} title="Backend" desc="Node.js, SQL, Databases" />
            <SkillCard icon={<Palette className="w-6 h-6" />} title="Design" desc="UI/UX, Responsive, Modern" />
            <SkillCard icon={<Cpu className="w-6 h-6" />} title="System" desc="CIS Analysis, Architecture" />
          </div>

        </div>
      </div>
    </section>
  );
};

const SkillCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-300">
    <div className="w-12 h-12 bg-black rounded-lg border border-zinc-800 flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h4 className="text-white font-bold mb-1">{title}</h4>
    <p className="text-zinc-500 text-sm">{desc}</p>
  </div>
);

export default About;