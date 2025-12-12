import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChatBot from './components/AIChatBot';
import SplashScreen from './components/SplashScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'contact'>('home');

  // Logic to handle page switching and scrolling
  const handleNavigation = (destination: string) => {
    if (destination === 'projects') {
      setCurrentPage('projects');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (destination === 'contact') {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // It's a hash link (e.g., #hero, #about)
      if (currentPage !== 'home') {
        setCurrentPage('home');
        // Small timeout to allow the Home component to mount before scrolling
        setTimeout(() => {
          const element = document.querySelector(destination);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(destination);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {isLoading ? (
        <SplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <>
          <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
          
          <div className="animate-fade-in-up">
            <main>
              {currentPage === 'home' && (
                <>
                  <Hero />
                  <About />
                </>
              )}
              {currentPage === 'projects' && (
                <Projects onBack={() => handleNavigation('#hero')} />
              )}
              {currentPage === 'contact' && (
                <Contact onBack={() => handleNavigation('#hero')} />
              )}
            </main>
            {/* Show Footer only on Home, or generally. Here keeping it for consistency */}
            <Footer />
          </div>
          
          <AIChatBot />
        </>
      )}
    </div>
  );
}

export default App;