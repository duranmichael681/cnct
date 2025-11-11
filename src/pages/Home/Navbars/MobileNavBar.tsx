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
        <div className="fixed bottom-0 left-0 flex flex-row w-full bg-[#081E3F] h-16 justify-center items-center gap-14 shadow-lg">
          <Link to="/home" className="h-6 aspect-square hover:scale-110 transition-transform">
            <HomeIcon className="w-full h-full" />
          </Link>
          <Link to="/discover" className="h-6 aspect-square hover:scale-110 transition-transform">
            <ExploreIcon className="w-full h-full" />
          </Link>
          <Link to="/create" className="h-6 aspect-square hover:scale-110 transition-transform">
            <CreateIcon className="w-full h-full" />
          </Link>
          <Link to="/profile" className="h-6 aspect-square hover:scale-110 transition-transform">
            <ProfileIcon className="w-full h-full" />
          </Link>
          <button 
            onClick={toggleTheme}
            className="hover:scale-110 transition-transform p-1"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun width={20} height={20} color="white" />
            ) : (
              <Moon width={20} height={20} color="white" />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
