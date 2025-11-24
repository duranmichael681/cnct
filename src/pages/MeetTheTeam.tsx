import { useLocation } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

interface TeamMember {
  name: string;
  role: string;
  description: string[];
  linkedin: string;
  imagePlaceholder: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Paul John Reyes',
    role: 'Developer',
    description: ['TBA'],
    linkedin: 'https://www.linkedin.com/in/pauljohnreyes',
    imagePlaceholder: 'PJR',
  },
  {
    name: 'Cristian Mantilla',
    role: 'Full Stack Developer',
    description: [
      'Worked on Frontend and backend endpoints for profile page',
      'Implemented logging of user activity',
      'More work TBA',
    ],
    linkedin: 'https://www.linkedin.com/in/cristian-mantilla-8560a3293/',
    imagePlaceholder: 'CM',
  },
  {
    name: 'Matthew Fortes',
    role: 'Backend Developer',
    description: [
      'Designed backend handling of image uploads',
      'Developed validation for events and profiles',
      'Designed exception handling in controllers',
    ],
    linkedin: 'https://www.linkedin.com/in/matthewfortes/',
    imagePlaceholder: 'MF',
  },
  {
    name: 'Jose Uribe',
    role: 'Backend Co-Lead',
    description: [
      'Co-led the backend team, set up initial server architecture',
      'Managed Supabase database schema and RLS policies',
      'Set up Google OAuth project',
      'Contributed to backend documentation, issue planning, and merge reviews',
      'Will finalize error handling',
    ],
    linkedin: 'https://www.linkedin.com/in/jose-uribe-26965a241/',
    imagePlaceholder: 'JU',
  },
  {
    name: 'Mario Casas',
    role: 'Frontend Lead',
    description: [
      'Built core frontend features including profile pages (guest and admin views)',
      'Developed onboarding flows with sign-up questionnaire form',
      'Created discover feed, content filtering, groups listing, and post card components',
      'Improved global UI/UX elements: theme toggle, navbar, settings, home, and landing pages',
      'Contributed to Supabase user login authentication',
    ],
    linkedin: 'https://www.linkedin.com/in/mario-casas-08491b21b/',
    imagePlaceholder: 'MC',
  },
  {
    name: 'Nicholas Ulloa',
    role: 'Database Architect',
    description: [
      'Designed and implemented database architecture for Supabase',
      'Created schema design for core tables to support application',
      'Prepared datasets for testing, design, and the live app',
      'Implemented Google OAuth authentication for secure user login',
    ],
    linkedin: 'https://www.linkedin.com/in/nicholas-ulloa/',
    imagePlaceholder: 'NU',
  },
  {
    name: 'Jaylena Burgos',
    role: 'UX Designer',
    description: [
      'Assisted with frontend designs by providing feedback on existing features',
      'Suggested changes to improve user interaction and experience',
    ],
    linkedin: 'https://www.linkedin.com/in/jaylena-burgos-062043280',
    imagePlaceholder: 'JB',
  },
];

export default function MeetTheTeam() {
  const location = useLocation();
  
  // Show navbar if user is logged in, UNLESS explicitly coming from landing page footer
  const fromLanding = location.state?.fromLanding === true;
  const isLoggedIn = sessionStorage.getItem('hasVisitedApp') === 'true' || 
                     location.pathname.includes('/home') || 
                     location.pathname.includes('/profile');
  
  // Only hide navbar if coming from landing AND not logged in
  const showNavbar = isLoggedIn && !fromLanding;

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {showNavbar && <SideBar />}
      <div className={`flex-1 overflow-y-auto ${showNavbar ? 'pb-24 md:pb-0 md:ml-[70px]' : ''}`}>
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-4">
              Meet <span className="text-[var(--primary)]">The Team</span>
            </h1>
            <div className="w-32 h-1 bg-[var(--primary)] mx-auto mb-6" />
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              The talented developers who brought CNCT to life. We're FIU students passionate about connecting our campus community.
            </p>
          </div>

          {/* Team Members */}
          <div className="space-y-8 sm:space-y-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Mobile Layout */}
                <div className="flex flex-col items-center gap-6 sm:hidden">
                  {/* Profile Picture */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {member.imagePlaceholder}
                  </div>

                  {/* Name & Role */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--text)] mb-1">{member.name}</h2>
                    <p className="text-[var(--primary)] font-semibold">{member.role}</p>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2 w-full">
                    {member.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--text)]">
                        <span className="text-[var(--primary)] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-[#0077B5] hover:bg-[#006097] text-white rounded-full transition-colors font-semibold shadow-md"
                  >
                    <Linkedin size={20} />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-start gap-8">
                  {/* Left: Profile Picture */}
                  <div className="flex-shrink-0">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                      {member.imagePlaceholder}
                    </div>
                  </div>

                  {/* Middle: Name, Role & Description */}
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-[var(--text)] mb-1">{member.name}</h2>
                    <p className="text-[var(--primary)] font-semibold text-lg mb-4">{member.role}</p>
                    <ul className="space-y-2">
                      {member.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text)]">
                          <span className="text-[var(--primary)] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: LinkedIn */}
                  <div className="flex-shrink-0">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#0077B5] hover:bg-[#006097] text-white rounded-full transition-colors font-semibold shadow-md"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
