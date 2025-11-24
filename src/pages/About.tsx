import { useLocation, useNavigate } from 'react-router-dom';
import { Users, Calendar, MessageSquare, Sparkles, Link as LinkIcon } from 'lucide-react';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

export default function About() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Show navbar if user is logged in, UNLESS explicitly coming from landing page footer
  const fromLanding = location.state?.fromLanding === true;
  const isLoggedIn = sessionStorage.getItem('hasVisitedApp') === 'true' || 
                     location.pathname.includes('/home') || 
                     location.pathname.includes('/profile');
  
  // Only hide navbar if coming from landing AND not logged in
  const showNavbar = isLoggedIn && !fromLanding;

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/questionnaire/start');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {showNavbar && <SideBar />}
      <div className={`flex-1 overflow-y-auto ${showNavbar ? 'pb-24 md:pb-0 md:ml-[70px]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <LinkIcon size={48} className="text-[var(--primary)]" style={{ color: 'var(--primary)' }} />
              <h1 className="text-5xl sm:text-6xl font-bold text-[var(--text)]">
                <span className="text-[var(--primary)]">CNCT</span>
              </h1>
            </div>
            <div className="w-32 h-1 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-2xl font-bold text-[var(--text)] mb-4">Connect. Plan. Show Up.</p>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Built by FIU students, for FIU students. Making campus connections easier, one event at a time.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 sm:p-12 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-6">Our Mission</h2>
            <p className="text-lg text-[var(--text)] leading-relaxed mb-4">
              CNCT (shorter for connect) is a website where FIU students can easily create and join plans — from volleyball or running to sparring and study groups. Each plan has a messaging thread for quick coordination and a "Who's Going" list so everyone knows who's in.
            </p>
            <p className="text-lg text-[var(--text)] leading-relaxed">
              Our app is the cornerstone of social interaction for students wanting to come together and meet like-minded individuals. We want to cater to as many niche social groups as possible and invite new people to find new hobbies. We as a society try to just come to school, get to class, and get out. This app is supposed to invert that stigma — to get you out of your comfort zone, try new things, see new faces, and create new experiences.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[var(--text)] text-center mb-12">Why Use CNCT?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">Easy Event Creation</h3>
                <p className="text-[var(--text-secondary)]">
                  Create events in minutes. Add details, upload photos, set tags, and invite your fellow Panthers to join you for any campus activity.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">Connect with Community</h3>
                <p className="text-[var(--text-secondary)]">
                  Find and join events that match your interests. RSVP to let others know you're coming and see who else is attending.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">Real-Time Communication</h3>
                <p className="text-[var(--text-secondary)]">
                  Comment on events, ask questions, and coordinate with other attendees. Stay updated with messaging and notifications.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)] mb-3">Personalized Discovery</h3>
                <p className="text-[var(--text-secondary)]">
                  Our smart algorithm learns your preferences. Filter by tags, mark content as "Not Interested," and discover events you'll love.
                </p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 sm:p-12 shadow-lg mb-12">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-8 text-center">Our Brand</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full mb-2 shadow-lg" style={{ backgroundColor: '#b6862c' }} />
                <p className="text-sm font-bold text-[var(--text)]">Primary Gold</p>
                <p className="text-xs text-[var(--text-secondary)]">#B6862C</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full mb-2 shadow-lg" style={{ backgroundColor: '#081e3f' }} />
                <p className="text-sm font-bold text-[var(--text)]">Panther Blue</p>
                <p className="text-xs text-[var(--text-secondary)]">#081E3F</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full mb-2 shadow-lg" style={{ backgroundColor: '#c8a35c' }} />
                <p className="text-sm font-bold text-[var(--text)]">Accent Gold</p>
                <p className="text-xs text-[var(--text-secondary)]">#C8A35C</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full mb-2 shadow-lg border border-gray-300" style={{ backgroundColor: '#fffbeb' }} />
                <p className="text-sm font-bold text-[var(--text)]">Light Cream</p>
                <p className="text-xs text-[var(--text-secondary)]">#FFFBEB</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full mb-2 shadow-lg" style={{ backgroundColor: '#0f172a' }} />
                <p className="text-sm font-bold text-[var(--text)]">Dark Slate</p>
                <p className="text-xs text-[var(--text-secondary)]">#0F172A</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-[var(--secondary)] dark:bg-[var(--card-bg)] rounded-xl p-8 sm:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-[var(--background)] dark:text-[var(--text)] mb-6 text-center">Built With Modern Technology</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">React 19</p>
                <p className="text-sm opacity-80">Frontend Framework</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">TypeScript</p>
                <p className="text-sm opacity-80">Type Safety</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Tailwind CSS</p>
                <p className="text-sm opacity-80">Styling</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Vite</p>
                <p className="text-sm opacity-80">Build Tool</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Express.js</p>
                <p className="text-sm opacity-80">Backend Server</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Supabase</p>
                <p className="text-sm opacity-80">Database & Auth</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Framer Motion</p>
                <p className="text-sm opacity-80">Animations</p>
              </div>
              <div className="text-[var(--background)] dark:text-[var(--text)]">
                <p className="text-xl font-bold mb-1">Google OAuth</p>
                <p className="text-sm opacity-80">Authentication</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-[var(--text)] mb-6">
              Ready to Connect?
            </h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Join thousands of FIU students already using CNCT to find events, make friends, and build their campus community.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-lg font-bold rounded-lg transition-colors shadow-lg cursor-pointer"
            >
              Get Started Today
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
