import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowLeft, Play, X } from 'lucide-react';
import { getProjects } from '../services/projectService';
import { Project, MediaItem } from '../types';

interface ProjectsProps {
  onBack: () => void;
}

const VideoPlayer: React.FC<{ src: string; isActive: boolean }> = ({ src, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0; // Restart video when it appears
      videoRef.current.play().catch(console.error);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full h-full object-cover"
      muted
      loop
      playsInline
    />
  );
};

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  onMediaSelect: (media: MediaItem) => void;
}> = ({ project, index, onMediaSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Combine featured image with media gallery for the carousel
  const mediaList = project.media && project.media.length > 0
    ? project.media
    : [{ type: 'image', url: project.imageUrl } as MediaItem];
  const hasMultipleMedia = mediaList.length > 1;

  useEffect(() => {
    if (!hasMultipleMedia || isHovered) return;

    const currentMedia = mediaList[currentIndex];
    // Videos stay for 7 seconds, Images for 1.5 seconds (slightly smoother than 1s)
    const delay = currentMedia.type === 'video' ? 7000 : 1500;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, isHovered, hasMultipleMedia, mediaList]);

  return (
    <div className="group grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Auto-playing Carousel Side */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-zinc-800 aspect-video ${index % 2 === 1 ? 'md:order-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative overlays */}
        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 pointer-events-none z-20"></div>

        {/* Media Layers */}
        {mediaList.map((media, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              onClick={() => onMediaSelect(media)}
              style={{ cursor: 'pointer' }}
            >
              {media.type === 'video' ? (
                <VideoPlayer src={media.url} isActive={isActive} />
              ) : (
                <img
                  src={media.url}
                  alt={`${project.title} slide ${idx}`}
                  className="w-full h-full object-cover transform transition-transform duration-[2000ms] ease-out scale-100 hover:scale-105"
                  // Slightly zoom when active for a cinematic feel
                  style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
                />
              )}
            </div>
          );
        })}

        {/* Carousel Indicators */}
        {hasMultipleMedia && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {mediaList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-500 w-6' : 'bg-white/30 hover:bg-white/70 w-2'}`}
              />
            ))}
          </div>
        )}

        {/* Play Icon Hint for Videos */}
        {mediaList[currentIndex].type === 'video' && (
          <div className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 pointer-events-none">
            <Play className="w-5 h-5 text-white ml-0.5 opacity-80" />
          </div>
        )}
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
  );
};

const Projects: React.FC<ProjectsProps> = ({ onBack }) => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjectsList(data);
    };
    fetchProjects();
  }, []);

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
        <div className="space-y-32">
          {projectsList.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onMediaSelect={setSelectedMedia}
            />
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all z-50"
            onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-zinc-800"
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt="Enlarged media"
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-zinc-800 object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;