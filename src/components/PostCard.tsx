import { useState } from "react";

export default function PostCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Card (preview) */}
        <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-white dark:bg-slate-800 rounded-lg shadow p-4 transition hover:scale-[1.01] active:scale-[0.99]"
        >
        {/* User + Timestamp */}
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
            <p className="font-bold text-gray-900 dark:text-white">username</p>
            <p className="text-sm text-gray-500">2h ago</p>
            </div>
        </div>

        {/* Event Name */}
        <h3 className="text-lg font-semibold text-[var(--primary-text)] dark:text-white mb-3">
            Event Name Goes Here
        </h3>

        {/* Event Info */}
        <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-400 rounded-sm" /> {/* 📍 Icon */}
            <span>Event Location</span>
            </div>

            <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-400 rounded-sm" /> {/* 🕒 Icon */}
            <span>Event Time</span>
            </div>
        </div>

        {/* Post Image */}
        <div className="w-full h-48 bg-gray-200 dark:bg-slate-700 rounded-lg" />
        </div>

      {/* Modal (expanded view) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)} // click outside to close
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-[90%] max-w-2xl p-6 relative animate-fadeIn"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black dark:hover:text-white text-xl"
            >
              ×
            </button>

            {/* Event Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">username</p>
                <p className="text-sm text-gray-500">2h ago</p>
              </div>
            </div>

            {/* Big Event Name */}
            <h2 className="text-2xl font-bold text-[var(--primary-text)] dark:text-white mb-3">
              Event Name Goes Here
            </h2>

            {/* Event Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <span>Event Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <span>Event Time</span>
              </div>
            </div>

            {/* Image */}
            <div className="w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4" />

            {/* Buttons Row */}
            <div className="flex items-center gap-6 mb-4 text-gray-700 dark:text-gray-300">
                {/* RSVP */}
                <div className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white">
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" /> {/* 🔗 Placeholder */}
                    <span className="text-sm">12</span>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white">
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" /> {/* 💬 Placeholder */}
                    <span className="text-sm">3</span>
                </div>

                {/* Share */}
                <div className="flex items-center gap-1 cursor-pointer hover:text-black dark:hover:text-white">
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" /> {/* 🔄 Placeholder */}
                    <span className="text-sm">Share</span>
                </div>
            </div>


            {/* Description */}
            <p className="text-gray-800 dark:text-gray-300 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
            {["#Volleyball", "#CampusEvent", "#Sports", "#FunWeekend"].map((tag) => (
                <span
                key={tag}
                className="px-3 py-1 bg-[var(--menucard)] dark:bg-slate-700 text-[var(--primary-text)] dark:text-white text-sm rounded-full hover:bg-[var(--primary)] hover:text-[var(--background)] cursor-pointer transition"
                >
                {tag}
                </span>
            ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
