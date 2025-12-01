import { Flag, Ban, Share2, Edit3, Trash2, EyeOff } from 'lucide-react';

interface PostMenuProps {
  isOwnProfile: boolean;
  isHomeOrDiscover: boolean;
  onReport: () => void;
  onBlock: () => void;
  onNotInterested: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

/**
 * Dropdown menu component for post actions
 * Shows different options based on context (own profile, home/discover, etc.)
 */
export const PostMenu = ({
  isOwnProfile,
  isHomeOrDiscover,
  onReport,
  onBlock,
  onNotInterested,
  onEdit,
  onDelete,
  onShare,
}: PostMenuProps) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-10"
    >
      {/* Report button - always visible */}
      <button
        onClick={onReport}
        className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-t-lg"
      >
        <Flag size={16} />
        Report
      </button>

      {/* Block user - only if not own profile */}
      {!isOwnProfile && (
        <button
          onClick={onBlock}
          className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer"
        >
          <Ban size={16} />
          Block User
        </button>
      )}

      {/* Context-specific actions */}
      {isHomeOrDiscover ? (
        // Home/Discover page - show "Not Interested"
        <button
          onClick={onNotInterested}
          className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
        >
          <EyeOff size={16} />
          Not Interested
        </button>
      ) : isOwnProfile ? (
        // Own profile - show Edit and Delete
        <>
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer"
          >
            <Edit3 size={16} />
            Edit Post
          </button>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--danger)] cursor-pointer rounded-b-lg"
          >
            <Trash2 size={16} />
            Delete Post
          </button>
        </>
      ) : (
        // Other profiles - show Share
        <button
          onClick={onShare}
          className="w-full px-4 py-2 text-left hover:bg-[var(--menucard)] transition-colors flex items-center gap-2 text-[var(--text)] cursor-pointer rounded-b-lg"
        >
          <Share2 size={16} />
          Share
        </button>
      )}
    </div>
  );
};
