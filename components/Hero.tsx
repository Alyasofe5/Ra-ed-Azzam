import React, { useEffect, useState, useRef } from 'react';

// Code symbols to use as sparks (foreground) and background rain
const SPARK_SYMBOLS = ['{', '}', ';', '</>', '//', '0', '1', '&&', '||', '[]', '=>'];
const RAIN_SYMBOLS = ['0', '1', '{', '}', '</>', 'const', 'let', 'var', 'if', 'return', 'import', '&&', '||', '=>', 'function', 'class', 'npm'];

interface Spark {
  id: number;
  char: string;
  tx: string; // Target X translation
  ty: string; // Target Y translation
  rot: string; // Rotation
}

const Hero: React.FC = () => {
  const [isNeonOn, setIsNeonOn] = useState(true);
  const [sparks, setSparks] = useState<Spark[]>([]);
  
  // Typing animation state for brackets
  const [leftBracket, setLeftBracket] = useState('');
  const [rightBracket, setRightBracket] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Matrix Code Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#312e81'; // Indigo-900 (Dark Indigo for subtle background)
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = RAIN_SYMBOLS[Math.floor(Math.random() * RAIN_SYMBOLS.length)];
        
        // Randomly make some characters brighter (Indigo-500)
        if (Math.random() > 0.98) {
             ctx.fillStyle = '#6366f1'; 
             ctx.fillText(text, i * fontSize, drops[i] * fontSize);
             ctx.fillStyle = '#312e81'; // Reset to dark
        } else {
             ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Electrical Short Circuit Logic (Existing)
  useEffect(() => {
    const triggerShortCircuit = () => {
      // 1. Turn OFF (Short Circuit)
      setIsNeonOn(false);
      
      // 2. Generate Sparks (Code explosion)
      const newSparks: Spark[] = [];
      const sparkCount = 12 + Math.random() * 8; // Random count 12-20
      
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200; // How far they fly
        
        newSparks.push({
          id: Date.now() + i,
          char: SPARK_SYMBOLS[Math.floor(Math.random() * SPARK_SYMBOLS.length)],
          tx: `${Math.cos(angle) * distance}px`,
          ty: `${Math.sin(angle) * distance}px`,
          rot: `${Math.random() * 360}deg`,
        });
      }
      setSparks(newSparks);

      // 3. Clear sparks after animation
      setTimeout(() => {
        setSparks([]);
      }, 1000); 

      // 4. Turn back ON after a brief, erratic delay
      const flickerBackOn = () => {
        setTimeout(() => setIsNeonOn(true), 100);
        setTimeout(() => setIsNeonOn(false), 200);
        setTimeout(() => setIsNeonOn(true), 250);
      };
      
      setTimeout(flickerBackOn, 200 + Math.random() * 300);
    };

    // Run the short circuit effect
    const loop = () => {
      const nextDelay = 3000 + Math.random() * 5000;
      setTimeout(() => {
        triggerShortCircuit();
        loop();
      }, nextDelay);
    };

    loop();
    
    return () => {};
  }, []);

  // 3. Typewriter Effect for Brackets (Looping)
  useEffect(() => {
    let isMounted = true;

    const runAnimationLoop = async () => {
      // Initial delay for the very first run to match entry animations
      await new Promise(r => setTimeout(r, 1200));
      
      while (isMounted) {
        // Type Left
        setLeftBracket('<');
        
        // Wait for "RAED" (simulated)
        await new Promise(r => setTimeout(r, 800));
        if (!isMounted) break;
        
        // Type Right part 1
        setRightBracket('/');
        
        // Type Right part 2
        await new Promise(r => setTimeout(r, 150));
        if (!isMounted) break;
        setRightBracket('/>');
        
        // Hold visible for a few seconds
        await new Promise(r => setTimeout(r, 4000));
        if (!isMounted) break;

        // Clear (Reset) to simulate blinking/retyping
        setLeftBracket('');
        setRightBracket('');
        
        // Pause briefly before typing again
        await new Promise(r => setTimeout(r, 500));
      }
    };

    runAnimationLoop();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-20">
      
      {/* 1. Matrix Code Rain Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
      />

      {/* 2. Grid Overlay (Kept for texture) */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-0"></div>

      {/* 3. Static Developer Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        
        {/* Top Left: Code Tag */}
        <div className="absolute top-[10%] left-[5%] text-zinc-800/40 text-[8rem] md:text-[12rem] font-black -rotate-12 blur-[2px]">
          &lt;/&gt;
        </div>

        {/* Bottom Right: Curly Braces */}
        <div className="absolute bottom-[10%] right-[5%] text-zinc-800/40 text-[8rem] md:text-[12rem] font-black rotate-12 blur-[2px]">
          &#123; &#125;
        </div>

        {/* Middle Right: Function keyword */}
        <div className="absolute top-[30%] right-[15%] text-zinc-900 text-6xl font-mono font-bold opacity-30">
          const
        </div>

        {/* Middle Left: Array */}
        <div className="absolute bottom-[30%] left-[15%] text-zinc-900 text-6xl font-mono font-bold opacity-30">
          []
        </div>

        {/* Abstract Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
           <circle cx="10%" cy="20%" r="2" fill="#6366f1" />
           <circle cx="90%" cy="80%" r="2" fill="#6366f1" />
           <path d="M0 150 H 100 L 150 200 H 300" stroke="#312e81" strokeWidth="1" fill="none" />
           <path d="M100% 500 H calc(100% - 100) L calc(100% - 150) 450 H calc(100% - 300)" stroke="#312e81" strokeWidth="1" fill="none" />
           <rect x="80%" y="20%" width="50" height="50" stroke="#312e81" strokeWidth="1" fill="none" />
           <rect x="15%" y="70%" width="80" height="40" stroke="#312e81" strokeWidth="1" fill="none" />
        </svg>

      </div>
      
      {/* 4. Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-0"></div>

      {/* Spotlight Effect */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 via-black to-black pointer-events-none blur-3xl transition-opacity duration-100 z-0 ${isNeonOn ? 'opacity-60' : 'opacity-20'}`}></div>

      {/* ================================================================================== */}
      {/* Option 2: Bottom Left Tech Label (RESPONSIVE) */}
      {/* Changed: Removed 'hidden md:flex', used responsive sizing and positioning */}
      <div className="absolute bottom-6 left-4 md:bottom-12 md:left-8 flex items-center gap-2 md:gap-3 z-20 select-none opacity-50 md:opacity-30 hover:opacity-100 md:hover:opacity-80 transition-opacity duration-500">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
          <span className="font-black text-2xl md:text-5xl tracking-tighter text-zinc-800">
            PROGRAMMER
          </span>
      </div>
      {/* ================================================================================== */}


      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mb-20" ref={containerRef}>
        
        {/* Role Tag */}
        <div className="animate-fade-in-up mb-8 opacity-0" style={{ animationDelay: '0.1s' }}>
          <span className="px-4 py-2 rounded-full border border-zinc-800 bg-black/80 text-zinc-400 text-xs md:text-sm tracking-widest uppercase font-medium backdrop-blur-md shadow-lg">
             {'<'} CIS Specialist & Frontend Engineer {'/>'}
          </span>
        </div>
        
        {/* Main Name Typography */}
        <div className="animate-fade-in-up flex flex-col items-center space-y-[-0.1em] md:space-y-[-0.15em] opacity-0" style={{ animationDelay: '0.3s' }}>
          
          {/* First Line: < RAED */}
          <div className="flex items-baseline gap-2 md:gap-4 lg:gap-6">
            <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl text-zinc-800 font-black tracking-tighter select-none -translate-y-2 md:-translate-y-4 inline-block min-w-[0.8em] text-right">
              {leftBracket}
            </span>
            <h1 className="text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter text-white leading-none select-none relative z-10">
              RAED
            </h1>
          </div>
          
          {/* Second Line: AZZAM /> */}
          <div className="flex items-baseline gap-2 md:gap-4 lg:gap-6">
             {/* Last Name: Electrical Neon Effect */}
            <div className="relative inline-block z-10">
               <h1 
                 className={`
                   text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-none select-none cursor-default
                   text-outline transition-all duration-75
                   ${isNeonOn ? 'neon-active' : 'neon-off'}
                 `}
               >
                AZZAM
              </h1>
              
              {/* Render Sparks */}
              {sparks.map((spark) => (
                <span
                  key={spark.id}
                  className="code-spark"
                  style={{
                    top: '50%',
                    left: '50%',
                    '--tx': spark.tx,
                    '--ty': spark.ty,
                    '--rot': spark.rot,
                    animation: 'spark-fly 0.8s ease-out forwards'
                  } as React.CSSProperties}
                >
                  {spark.char}
                </span>
              ))}
            </div>
            <span className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl text-zinc-800 font-black tracking-tighter select-none -translate-y-2 md:-translate-y-4 inline-block min-w-[1.2em] text-left">
              {rightBracket}
            </span>
          </div>

        </div>

        {/* Short Bio (No Box) */}
        <p className="animate-fade-in-up mt-8 max-w-lg text-zinc-400 text-sm md:text-base leading-relaxed opacity-0" style={{ animationDelay: '0.5s' }}>
          Crafting high-performance web experiences with modern technologies. 
          Based in Jordan, focused on quality and precision.
        </p>

      </div>
    </section>
  );
};

export default Hero;