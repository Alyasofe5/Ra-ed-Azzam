import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onNavigate: (destination: string) => void;
  currentPage: 'home' | 'projects' | 'contact';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigate(href);
  };

  const isContactActive = currentPage === 'contact';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <div className="pointer-events-auto w-full md:w-auto">
        <div 
          className={`
            glass transition-all duration-500 mx-auto
            ${isOpen 
              ? 'rounded-3xl bg-black/95 border-zinc-800 p-6 flex flex-col gap-6' 
              : 'rounded-full px-2 py-2 pr-3 flex items-center justify-between gap-4 md:gap-8 pl-6'
            }
          `}
        >
          
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo area - Acts as Home button */}
            <a 
              href="#hero" 
              onClick={(e) => handleNavClick(e, '#hero')}
              className="text-lg font-black tracking-tighter text-white pointer-events-auto hover:opacity-80 transition-opacity"
            >
              RAED<span className="text-indigo-500">.</span>
            </a>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-zinc-400 hover:text-white p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          
          <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center gap-2 md:gap-6 w-full md:w-auto`}>
            {NAV_ITEMS.map((item) => {
              let isActive = false;
              if (item.href === 'projects' && currentPage === 'projects') isActive = true;
              
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm font-medium transition-all w-full md:w-auto text-center py-3 md:py-0 cursor-pointer 
                    ${isActive 
                      ? 'text-white' 
                      : 'text-zinc-400 hover:text-white'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
            
            {/* Eye-catching Hire Me Button */}
            <a 
              href="contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className={`
                relative group overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold transition-all text-center cursor-pointer
                ${isOpen ? 'w-full mt-4' : 'mt-0'}
                ${isContactActive ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Hire Me
                {/* Visual indicator dot */}
                {!isContactActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:bg-white transition-colors"></span>
                )}
              </span>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-indigo-600 transition-transform duration-300 ease-out z-0"></div>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;