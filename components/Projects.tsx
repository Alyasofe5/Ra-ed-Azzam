import React from 'react';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { PROJECTS } from '../constants';

interface ProjectsProps {
  onBack: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onBack }) => {
  return (
    <div className="pt-32 pb-20 bg-black min-h-screen relative">
      
      {/* Option 1: Vertical Right Sidebar (Added to Other Pages) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-20 select-none">
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
          <span 
            style={{ writingMode: 'vertical-rl' }} 
            className="text-zinc-500 text-xs tracking-[0.6em] font-mono uppercase opacity-60 hover:text-indigo-400 hover:opacity-100 transition-all duration-300"
          >
              // PROGRAMMER
          </span>
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Navigation / Header */}
        <div className="mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            All Projects<span className="text-indigo-500">.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
             A detailed showcase of my technical journey, featuring web applications, system designs, and frontend experiments.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="space-y-24">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="group grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              
              {/* Image Side */}
              <div className={`relative overflow-hidden rounded-2xl border border-zinc-800 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content Side */}
              <div className={index % 2 === 1 ? 'md:order-1 md:text-right' : ''}>
                <div className="text-indigo-500 text-sm font-mono mb-4 flex items-center gap-2 justify-start md:justify-start">
                  <span className="w-8 h-[1px] bg-indigo-500 inline-block"></span>
                  Project 0{index + 1}
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-zinc-400 mb-8 leading-relaxed text-lg">
                  {project.description}
                </p>
                
                <div className={`flex flex-wrap gap-2 mb-8 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-4 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-medium rounded-full border border-zinc-800">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-6 ${index % 2 === 1 ? 'md:justify-end' : ''}`}>
                  <a href={project.demoUrl} className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                    View Live <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a href={project.repoUrl} className="px-6 py-3 border border-zinc-700 text-white rounded-full font-medium text-sm hover:bg-zinc-900 transition-all">
                    Codebase
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Projects;