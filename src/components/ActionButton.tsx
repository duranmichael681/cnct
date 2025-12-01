import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  count?: number;
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
  label: string;
  loading?: boolean;
  hovered?: boolean;
  activeColor?: string;
  hoverColor?: string;
}

/**
 * Reusable action button component for post interactions
 * Used for RSVP, comments, shares, etc.
 */
export const ActionButton = ({
  icon: Icon,
  count,
  active = false,
  onClick,
  label,
  loading = false,
  hovered = false,
  activeColor = 'var(--primary)',
  hoverColor = 'var(--primary)',
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-1 transition-all hover:scale-110 transform duration-200 ${
        active ? 'font-bold' : ''
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        color: active ? activeColor : hovered ? hoverColor : 'var(--text-secondary)',
      }}
      aria-label={label}
    >
      <Icon 
        size={16} 
        className="md:w-5 md:h-5" 
        fill={active ? activeColor : 'transparent'}
        stroke={active ? activeColor : hoverColor}
      />
      {count !== undefined && (
        <span className="text-xs md:text-sm">{count}</span>
      )}
    </button>
  );
};
