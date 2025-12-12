import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setOpacity(0); // Fade out
            setTimeout(onFinish, 500); // Trigger finish after fade out
          }, 200);
          return 100;
        }
        // Randomize speed slightly for realism
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black transition-opacity duration-500"
      style={{ opacity: opacity }}
    >
      <div className="w-full max-w-md px-8 text-center">
        {/* Logo */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2 animate-pulse">
          RAED<span className="text-indigo-500">.</span>
        </h1>
        <p className="text-zinc-500 text-sm tracking-[0.3em] uppercase mb-12">
          System Initializing
        </p>

        {/* Progress Bar Container */}
        <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Percentage and Status */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs font-mono text-zinc-600">
            LOADING ASSETS...
          </span>
          <span className="text-2xl font-bold font-mono text-white">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* Background Grid Effect (Optional subtle detail) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
    </div>
  );
};

export default SplashScreen;