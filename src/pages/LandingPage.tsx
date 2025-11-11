import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import HeroImage from '../assets/hero.jpg';
import WhatIsCNCT from '../assets/image1.jpg';
import HowItWorks from '../assets/how-it-works.jpg';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <SideBar />
      
      <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <div className="max-w-[1440px] mx-auto">
          {/* Hero Section */}
          <section className="relative px-6 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 mt-8 md:mt-0">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="flex-1 z-10 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[var(--text)] mb-6">
                  Welcome to <span className="font-extrabold text-[var(--primary)]">CNCT!</span>
                </h1>
                <div className="w-32 sm:w-44 h-1 bg-[var(--primary)] mb-6" />
                <p className="text-lg sm:text-xl font-bold text-[var(--text)] mb-8">
                  Join activities, sports, events and more.
                </p>
                <Link
                  to="/home"
                  className="inline-block px-8 sm:px-12 py-3 sm:py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] dark:text-[var(--background)] text-lg sm:text-xl font-bold rounded-tl-[20px] rounded-tr-[60px] rounded-bl-[20px] rounded-br-[20px] transition-all cursor-pointer shadow-lg hover:shadow-xl"
                >
                  Get Started Now
                </Link>
              </div>

              {/* Right Hero Image */}
              <div className="flex-1 w-full lg:w-auto animate-fade-in-delay-1">
                <div className="bg-[var(--card-bg)] rounded-tl-[60px] rounded-bl-[60px] overflow-hidden shadow-2xl border border-[var(--border)]">
                  <img 
                    src={HeroImage} 
                    alt="Students connecting" 
                    className="w-full h-64 sm:h-80 lg:h-[482px] object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* What is CNCT Section */}
          <section className="px-6 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 bg-[var(--card-bg)] dark:bg-[var(--background)]">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--primary)] mb-8 animate-fade-in">
              What is CNCT?
            </h2>
            
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              {/* Image */}
              <div className="w-full lg:w-1/2 animate-fade-in-delay-1">
                <img 
                  src={WhatIsCNCT} 
                  alt="Students collaborating" 
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-br-[60px] shadow-2xl border border-[var(--border)]"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 animate-fade-in-delay-2">
                <div className="w-11 h-1 bg-[var(--primary)] mb-6" />
                <p className="text-lg sm:text-xl font-bold text-[var(--text)] leading-relaxed">
                  CNCT shorter for connect is a website where FIU students can easily create and join plans — from volleyball or running to sparring and study groups. Each plan has a messaging thread for quick coordination and a "Who's Going" list so everyone knows who's in.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="px-6 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 bg-[var(--background)]">
            <div className="bg-[var(--secondary)] dark:bg-[var(--card-bg)] rounded-lg p-8 sm:p-12 lg:p-16 shadow-2xl border border-[var(--border)]">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--background)] dark:text-[var(--primary)] mb-4">
                How It works
              </h2>
              <div className="w-20 h-1 bg-[var(--tertiary)] dark:bg-[var(--primary)] mb-8" />

              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
                {/* Text Content */}
                <div className="flex-1 text-[var(--background)] dark:text-[var(--text)]">
                  <p className="text-lg sm:text-xl font-bold leading-relaxed mb-4">
                    If you ever want to get out of your comfort zone, learn a new hobby, or meet new people, CNCT makes it simple.
                  </p>
                  <p className="text-lg sm:text-xl font-bold leading-relaxed mb-4">
                    Just hit "Find a Plan" to see what's happening around campus — sports, study groups, workouts, and more.
                  </p>
                  <p className="text-lg sm:text-xl font-bold leading-relaxed">
                    Got something more niche in mind? "Create a plan" and let others RSVP to join you.
                  </p>
                </div>

                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <img 
                    src={HowItWorks} 
                    alt="How CNCT works" 
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-tl-[60px] shadow-2xl border border-[var(--tertiary)]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="px-6 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 text-center bg-[var(--card-bg)] dark:bg-[var(--background)]">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--primary)] mb-12">
              What are you waiting for?
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/discover"
                className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-[var(--secondary)] dark:bg-[var(--card-bg)] text-[var(--background)] dark:text-[var(--text)] border-2 border-[var(--border)] rounded-xl hover:opacity-90 hover:scale-105 transition-all cursor-pointer text-sm font-bold shadow-lg"
              >
                <Search size={24} />
                Join a Plan
              </Link>
              <Link
                to="/create"
                className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] dark:text-[var(--background)] border-2 border-[var(--primary)] rounded-xl hover:scale-105 transition-all cursor-pointer text-sm font-bold shadow-lg"
              >
                <Users size={24} />
                Create a Plan
              </Link>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
