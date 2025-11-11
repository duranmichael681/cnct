import { useState } from "react";

export default function PostCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Card (preview) */}
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-[var(--card-bg)] rounded-lg shadow-md p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] border border-transparent hover:border-[var(--primary)]"
      >
        {/* User + Timestamp */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] rounded-full" />
          <div>
            <p className="font-bold text-[var(--text)]">username</p>
            <p className="text-sm text-[var(--text-secondary)]">2h ago</p>
          </div>
        </div>

        {/* Event Name */}
        <h3 className="text-lg font-semibold text-[var(--text)] mb-3 hover:text-[var(--primary)] transition-colors">
          Event Name Goes Here
        </h3>

        {/* Event Info */}
        <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[var(--primary)] rounded-sm" /> {/* 📍 Icon */}
            <span>Event Location</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[var(--primary)] rounded-sm" /> {/* 🕒 Icon */}
            <span>Event Time</span>
          </div>
        </div>

        {/* Post Image */}
        <div className="w-full h-48 bg-gradient-to-br from-[var(--menucard)] to-[var(--background)] rounded-lg overflow-hidden group">
          <div className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>

      {/* Modal (expanded view) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)} // click outside to close
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            className="bg-[var(--card-bg)] rounded-xl shadow-2xl w-[90%] max-w-2xl p-6 relative animate-fadeIn"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text)] text-2xl hover:rotate-90 transition-all duration-300"
            >
              ×
            </button>

            {/* Event Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--tertiary)] rounded-full" />
              <div>
                <p className="font-bold text-[var(--text)]">username</p>
                <p className="text-sm text-[var(--text-secondary)]">2h ago</p>
              </div>
            </div>

            {/* Big Event Name */}
            <h2 className="text-2xl font-bold text-[var(--text)] mb-3">
              Event Name Goes Here
            </h2>

            {/* Event Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-[var(--primary)] rounded-sm" />
                <span>Event Location</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-[var(--primary)] rounded-sm" />
                <span>Event Time</span>
              </div>
            </div>

            {/* Image */}
            <div className="w-full h-64 bg-gradient-to-br from-[var(--menucard)] to-[var(--background)] rounded-lg mb-4" />

            {/* Buttons Row */}
            <div className="flex items-center gap-6 mb-4 text-[var(--text-secondary)]">
              {/* RSVP */}
              <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200">
                <div className="w-5 h-5 bg-[var(--primary)] rounded-sm" /> {/* 🔗 Placeholder */}
                <span className="text-sm">12</span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200">
                <div className="w-5 h-5 bg-[var(--primary)] rounded-sm" /> {/* 💬 Placeholder */}
                <span className="text-sm">3</span>
              </div>

              {/* Share */}
              <div className="flex items-center gap-1 cursor-pointer hover:text-[var(--primary)] transition-colors hover:scale-110 transform duration-200">
                <div className="w-5 h-5 bg-[var(--primary)] rounded-sm" /> {/* 🔄 Placeholder */}
                <span className="text-sm">Share</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[var(--text)] mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {["#Volleyball", "#CampusEvent", "#Sports", "#FunWeekend"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[var(--menucard)] text-[var(--text)] text-sm rounded-full hover:bg-[var(--primary)] hover:text-white cursor-pointer transition-all duration-200 hover:scale-105"
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
