export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="hidden md:block w-screen bg-[var(--secondary)] dark:bg-[var(--card-bg)] overflow-hidden py-16 px-6 sm:px-10 lg:px-20 relative z-0">
      <div className="w-full max-w-[1920px] mx-auto relative">
        {/* Top Section - CNCT Branding */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-[var(--background)] dark:text-[var(--text)] text-3xl sm:text-4xl font-bold font-['Rubik']">CNCT</h1>
          <div className="hidden sm:block w-px h-14 bg-[var(--background)] dark:bg-[var(--border)]" />
          <p className="text-[var(--background)] dark:text-[var(--text)] text-lg sm:text-xl font-bold font-['Rubik']">Connect. Plan. Show Up.</p>
        </div>

        {/* Divider and Navigation Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-6">
          <div className="hidden sm:block w-px h-24 bg-[var(--background)] dark:bg-[var(--border)]" />
          <div className="space-y-4">
            <button className="block text-[var(--background)] dark:text-[var(--text)] text-xl sm:text-2xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer text-left">
              Meet The Team
            </button>
            <p className="text-[var(--background)] dark:text-[var(--text-secondary)] text-xs font-bold font-['Rubik']">Built by FIU students</p>
            <button className="block text-[var(--background)] dark:text-[var(--text)] text-xl sm:text-2xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer text-left">
              FAQ
            </button>
            <button className="block text-[var(--background)] dark:text-[var(--text)] text-xl sm:text-2xl font-bold font-['Rubik'] hover:text-[var(--primary)] transition-colors cursor-pointer text-left">
              About
            </button>
          </div>
        </div>

        {/* Back to Top */}
        <button 
          onClick={scrollToTop}
          className="mt-12 text-[var(--primary)] hover:text-[var(--primary-hover)] text-base sm:text-lg font-bold font-['Rubik'] hover:underline transition-all cursor-pointer"
        >
          Back to the Top
        </button>
      </div>
    </footer>
  );
}