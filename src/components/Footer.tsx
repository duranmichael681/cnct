import { useNavigate, useLocation } from 'react-router-dom';
import { Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  
  // Check if user is logged in
  const isLoggedIn = sessionStorage.getItem('hasVisitedApp') === 'true' || 
                     location.pathname.includes('/home') || 
                     location.pathname.includes('/profile');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  return (
    <footer className="hidden md:block w-full bg-[var(--secondary)] dark:bg-[var(--card-bg)] py-8 px-4 sm:px-6 lg:px-8 relative z-0 md:pl-[calc(70px+1rem)] lg:pl-[calc(70px+2rem)]">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Main Content - Left, Middle, Right */}
        <div className="flex justify-between items-center gap-4">
          {/* Left Side - Branding */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <motion.button
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <LinkIcon size={28} className="text-[var(--primary)]" />
              </motion.div>
              <h1 className="text-[var(--background)] dark:text-[var(--text)] text-2xl font-bold font-['Rubik']">CNCT</h1>
              <div className="w-px h-8 bg-[var(--background)] dark:bg-[var(--border)]" />
              <p className="text-[var(--background)] dark:text-[var(--text)] text-base font-bold font-['Rubik']">Connect. Plan. Show Up.</p>
            </motion.button>
            <p className="text-[var(--background)] dark:text-[var(--text-secondary)] text-sm font-['Rubik']">Built by FIU students</p>
            <p className="text-[var(--background)] dark:text-[var(--text-secondary)] text-xs font-['Rubik']">© 2025 CNCT. All rights reserved.</p>
          </div>

          {/* Middle - Back to Top */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={scrollToTop}
              className="text-xl text-[var(--primary)] hover:text-[var(--primary-hover)] font-bold font-['Rubik'] hover:underline transition-all cursor-pointer whitespace-nowrap"
            >
              Back to Top ↑
            </button>
          </div>

          {/* Right Side - Navigation Section */}
          <div className="flex flex-col gap-3 items-center flex-shrink-0">
            <h2 className="text-[var(--background)] dark:text-[var(--text)] text-2xl font-bold font-['Rubik']">Navigate</h2>
            <div className="flex gap-6 items-center">
              <button 
                onClick={() => navigate('/about', { state: { fromLanding: true } })}
                onMouseEnter={() => setHoveredButton('about')}
                onMouseLeave={() => setHoveredButton(null)}
                className="flex items-center gap-2 text-[var(--background)] dark:text-[var(--text)] text-lg font-bold font-['Rubik'] hover:text-[var(--primary)] transition-all cursor-pointer whitespace-nowrap"
              >
                About
                {hoveredButton === 'about' && <ArrowRight size={18} className="animate-pulse" />}
              </button>
              <button 
                onClick={() => navigate('/meet-the-team', { state: { fromLanding: true } })}
                onMouseEnter={() => setHoveredButton('team')}
                onMouseLeave={() => setHoveredButton(null)}
                className="flex items-center gap-2 text-[var(--background)] dark:text-[var(--text)] text-lg font-bold font-['Rubik'] hover:text-[var(--primary)] transition-all cursor-pointer whitespace-nowrap"
              >
                Meet The Team
                {hoveredButton === 'team' && <ArrowRight size={18} className="animate-pulse" />}
              </button>
              <button 
                onClick={() => navigate('/faq', { state: { fromLanding: true } })}
                onMouseEnter={() => setHoveredButton('faq')}
                onMouseLeave={() => setHoveredButton(null)}
                className="flex items-center gap-2 text-[var(--background)] dark:text-[var(--text)] text-lg font-bold font-['Rubik'] hover:text-[var(--primary)] transition-all cursor-pointer whitespace-nowrap"
              >
                FAQ
                {hoveredButton === 'faq' && <ArrowRight size={18} className="animate-pulse" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
