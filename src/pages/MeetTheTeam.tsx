import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

// Import profile pictures
import marioCasasPfp from '../assets/pfps/MarioCasas.png';
import nicholasUlloaPfp from '../assets/pfps/NicholasUlloa.jpeg';
import joseUribePfp from '../assets/pfps/JoseUribe.jpg';
import cristianMantillaPfp from '../assets/pfps/CristianMantilla.png';
import jaylenaBurgosPfp from '../assets/pfps/JaylenaBurgos.jpeg';
import michaelDuranPfp from '../assets/pfps/michael_duran.jpeg';
import santiagoMunozPfp from '../assets/pfps/santiago_munoz.jpeg';
import jorgeTabanPfp from '../assets/pfps/jorge_taban.jpg';
import matthewFortesPfp from '../assets/pfps/matthew_fortes.jpeg';
import paulReyesPfp from '../assets/pfps/paul_reyes.jpeg';
import isabellaMitchellPfp from '../assets/pfps/IsabellaMitchell.png';

interface TeamMember {
  name: string;
  role: string;
  description: string[];
  linkedin: string;
  imagePlaceholder: string;
  image?: string;
  category: 'lead' | 'frontend-lead' | 'backend-lead' | 'frontend' | 'backend' | 'fullstack';
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
      {/* Mobile Layout */}
      <div className="flex flex-col items-center gap-6 sm:hidden">
        {/* Profile Picture */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            member.imagePlaceholder
          )}
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--text)] mb-1">{member.name}</h3>
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
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] flex items-center justify-center text-white text-5xl font-bold shadow-lg overflow-hidden">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              member.imagePlaceholder
            )}
          </div>
        </div>

        {/* Middle: Name, Role & Description */}
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-[var(--text)] mb-1">{member.name}</h3>
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
  );
}

const teamMembers: TeamMember[] = [
  // Project Lead
  {
    name: 'Michael Duran',
    role: 'Project Lead & Frontend Co-Lead',
    description: ['TBA'],
    linkedin: 'https://www.linkedin.com/in/michael-a-duran/',
    imagePlaceholder: 'MD',
    image: michaelDuranPfp,
    category: 'lead',
  },
  // Frontend Co-Lead
  {
    name: 'Santiago Munoz',
    role: 'Frontend Co-Lead',
    description: ['TBA'],
    linkedin: 'https://www.linkedin.com/in/santiago-munoz-63b260313/',
    imagePlaceholder: 'SM',
    image: santiagoMunozPfp,
    category: 'frontend-lead',
  },
  // Backend Co-Leads
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
    image: joseUribePfp,
    category: 'backend-lead',
  },
  {
    name: 'Jorge Taban',
    role: 'Backend Co-Lead',
    description: ['TBA'],
    linkedin: 'https://www.linkedin.com/in/jorgetaban/',
    imagePlaceholder: 'JT',
    image: jorgeTabanPfp,
    category: 'backend-lead',
  },
  // Full Stack Developers
  {
    name: 'Mario Casas',
    role: 'Full Stack Developer',
    description: [
      'Built core frontend features including profile pages (guest and admin views)',
      'Developed onboarding flows with sign-up questionnaire form',
      'Created discover feed, content filtering, groups listing, and post card components',
      'Improved global UI/UX elements: theme toggle, navbar, settings, home, and landing pages',
      'Contributed to Supabase user login authentication',
    ],
    linkedin: 'https://www.linkedin.com/in/mario-casas-08491b21b/',
    imagePlaceholder: 'MC',
    image: marioCasasPfp,
    category: 'fullstack',
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
    image: cristianMantillaPfp,
    category: 'fullstack',
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
    image: nicholasUlloaPfp,
    category: 'fullstack',
  },
  // Frontend Developers
  {
    name: 'Jaylena Burgos',
    role: 'UX Designer',
    description: [
      'Assisted with frontend designs by providing feedback on existing features',
      'Suggested changes to improve user interaction and experience',
    ],
    linkedin: 'https://www.linkedin.com/in/jaylena-burgos-062043280',
    imagePlaceholder: 'JB',
    image: jaylenaBurgosPfp,
    category: 'frontend',
  },
  // Backend Developers
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
    image: matthewFortesPfp,
    category: 'backend',
  },
  {
    name: 'Paul Reyes',
    role: 'Backend Developer',
    description: ['TBA'],
    linkedin: 'https://www.linkedin.com/in/pauljohnreyes',
    imagePlaceholder: 'PR',
    image: paulReyesPfp,
    category: 'backend',
  },
  {
    name: 'Isabella Mitchell',
    role: 'Backend Developer',
    description: [
      'Handled authentication functions for signup and signin',
      'Developed UI and handled frontend fixes',
    ],
    linkedin: 'https://www.linkedin.com/in/isabella-mi/',
    imagePlaceholder: 'IM',
    image: isabellaMitchellPfp,
    category: 'backend',
  },
];

export default function MeetTheTeam() {
  const location = useLocation();
  
  useEffect(() => {
    document.title = 'CNCT | Meet The Team';
  }, []);
  
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
          <div className="space-y-12">
            {/* Project Lead */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Project Lead</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'lead')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>

            {/* Frontend Leadership */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Frontend Leadership</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'frontend-lead')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>

            {/* Backend Leadership */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Backend Leadership</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'backend-lead')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>

            {/* Full Stack Developers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Full Stack Developers</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'fullstack')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>

            {/* Frontend Developers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Frontend Developers</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'frontend')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>

            {/* Backend Developers */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-[var(--text)] mb-6 text-center">
                <span className="text-[var(--primary)]">Backend Developers</span>
              </h2>
              <div className="space-y-8">
                {teamMembers
                  .filter((member) => member.category === 'backend')
                  .map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
