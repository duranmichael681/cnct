import { Moon, Sun } from 'lucide-react'
import HomeIcon from '../../../components/icons/HomeIcon.tsx'
import ExploreIcon from '../../../components/icons/ExploreIcon.tsx'
import ProfileIcon from '../../../components/icons/ProfileIcon.tsx'
import CreateIcon from '../../../components/icons/CreateIcon.tsx'
import { Outlet, Link } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'

export default function MobileNavBar() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <>
      <Outlet />
      <div className="h-dvh">
        <div className={`fixed bottom-0 left-0 flex flex-row w-full h-16 justify-center items-center gap-14 shadow-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-[#081E3F] to-[var(--primary)]' 
            : 'bg-[#081E3F]'
        }`}>
          <Link to="/home" className="h-6 aspect-square hover:scale-110 transition-transform cursor-pointer">
            <HomeIcon className="w-full h-full" />
          </Link>
          <Link to="/discover" className="h-6 aspect-square hover:scale-110 transition-transform cursor-pointer">
            <ExploreIcon className="w-full h-full" />
          </Link>
          <Link to="/create" className="h-6 aspect-square hover:scale-110 transition-transform cursor-pointer">
            <CreateIcon className="w-full h-full" />
          </Link>
          <Link to="/profile" className="h-6 aspect-square hover:scale-110 transition-transform cursor-pointer">
            <ProfileIcon className="w-full h-full" />
          </Link>
          <button 
            onClick={toggleTheme}
            className="hover:scale-110 transition-transform p-1 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun width={20} height={20} color="#C8A35C" className='hover:drop-shadow-[0_0_8px_rgba(200,163,92,0.6)]' />
            ) : (
              <Moon width={20} height={20} color="white" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
