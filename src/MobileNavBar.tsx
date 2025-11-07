import { useState } from 'react'
import HomeIcon from './components/icons/HomeIcon.tsx'
import ExploreIcon from './components/icons/ExploreIcon.tsx'
import ProfileIcon from './components/icons/ProfileIcon.tsx'
import CreateIcon from './components/icons/CreateIcon.tsx'
import { Link } from 'react-router'

export default function MobileNavBar() {
    const [nightModeToggle, setNightModeToggle] = useState(true);
    return (
        <div className="h-dvh">
            <div className="fixed bottom-0 left-0 flex flex-row w-full bg-[#081E3F] h-3/32 justify-center items-center" style={{ gap: "calc(56/360 * 100%)"}}>
                <a className="h-25/60 aspect-square" ><HomeIcon className="w-full h-full"/></a>
                <a className="h-25/60 aspect-square" ><ExploreIcon className="w-full h-full" /></a>
                <a className="h-25/60 aspect-square"><ProfileIcon className="w-full h-full" /></a>
                <a className="h-25/60 aspect-square"><CreateIcon  className="w-full h-full"/></a>
            </div>
        </div>
    )
}
