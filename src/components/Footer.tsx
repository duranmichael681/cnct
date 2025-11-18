export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="hidden md:block w-screen bg-[var(--secondary)] dark:bg-[var(--card-bg)] overflow-hidden py-8 px-6 sm:px-10 lg:px-20 relative z-0 md:pl-[calc(70px+1.5rem)] lg:pl-[calc(70px+5rem)]">
      <div className="w-full max-w-[1920px] mx-auto relative">
        {/* Main Content - Left, Middle, Right */}
        <div className="flex justify-between items-start gap-8">
          {/* Left Side - Branding */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-[var(--background)] dark:text-[var(--text)] text-3xl font-bold font-['Rubik']">CNCT</h1>
              <div className="w-px h-10 bg-[var(--background)] dark:bg-[var(--border)]" />
              <p className="text-[var(--background)] dark:text-[var(--text)] text-lg font-bold font-['Rubik']">Connect. Plan. Show Up.</p>
            </div>
            <p className="text-[var(--background)] dark:text-[var(--text-secondary)] text-sm font-['Rubik']">Built by FIU students</p>
            <p className="text-[var(--background)] dark:text-[var(--text-secondary)] text-xs font-['Rubik']">© 2025 CNCT. All rights reserved.</p>
          </div>

          {/* Middle - Back to Top */}
          <div className="flex items-center">
            <button 
              onClick={scrollToTop}
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-lg font-bold font-['Rubik'] hover:underline transition-all cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>

          {/* Right Side - Navigation */}
          <div className="flex gap-8 items-start">
            <button className="text-[var(--background)] dark:text-[var(--text)] text-xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer">
              Meet The Team
            </button>
            <button className="text-[var(--background)] dark:text-[var(--text)] text-xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer">
              FAQ
            </button>
            <button className="text-[var(--background)] dark:text-[var(--text)] text-xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer">
              About
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}