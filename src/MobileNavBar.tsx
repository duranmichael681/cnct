import { useState } from 'react'
import HomeIcon from './components/icons/HomeIcon.tsx'
import ExploreIcon from './components/icons/ExploreIcon.tsx'
import ProfileIcon from './components/icons/ProfileIcon.tsx'
import CreateIcon from './components/icons/CreateIcon.tsx'

export default function MobileNavBar() {
    const [nightModeToggle, setNightModeToggle] = useState(true);
    return (
        <div className="h-dvh">
        <div className="gap-56/360flex flex-row bottom-0 left-0 w-full bg-[#081E3F] h-3/32">
            <a><HomeIcon /></a>
            <a><ExploreIcon /></a>
            <a><ProfileIcon /></a>
            <a><CreateIcon /></a>
            <a></a>
        </div>
        </div>
    )
}
