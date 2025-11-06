import { useState } from "react";
import GroupList from "./GroupList";

export default function ProfileHeader() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // dropdown toggle

  return (
    <div className="relative bg-[var(--secondary)] text-[var(--background)] rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start gap-6">
      {/* Left Section: Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
        {/* Profile Picture */}
        <div className="w-32 h-32 bg-[var(--menucard)] rounded-full shrink-0" />

        <div>
          <h1 className="text-3xl font-bold text-[var(--primary-text)] dark:text-[var(--background)]">
            Person’s Name
          </h1>
          <p className="text-lg font-semibold text-[var(--tertiary)]">
            Pronouns • Major
          </p>
          <p className="mt-2 max-w-2xl text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam...
          </p>

          {/* Buttons */}
          <div className="mt-4 flex gap-3 items-center">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-6 py-2 rounded-full font-bold transition-colors
                ${
                  isFollowing
                    ? "bg-[var(--secondary-hover)] text-[var(--background)]"
                    : "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary-hover)]"
                }
              `}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            {/* More Options Button with Click Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-[var(--menucard)] text-[var(--secondary)] rounded-full font-bold hover:bg-[var(--menucard)] transition cursor-pointer"
              >
                ...
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-[var(--menucard)] text-[var(--primary-text)] rounded-lg shadow-lg z-10"
                >
                  <ul className="flex flex-col">
                    <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer">
                      Option 1
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer">
                      Option 2
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer">
                      Option 3
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Scrollable Group List */}
      <div className="w-full lg:w-[30%] flex-shrink-0 rounded-lg p-4 text-[var(--primary-text)]">
          <GroupList />
      </div>
    </div>
  );
}
