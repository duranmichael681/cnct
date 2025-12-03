interface StatItemProps {
  value: number;
  label: string;
  className?: string;
}

/**
 * Reusable stat display component
 * Shows a number value with a label underneath
 * Responsive sizing for mobile and desktop
 */
export const StatItem = ({ value, label, className = '' }: StatItemProps) => {
  return (
    <div className={`flex flex-col items-center lg:items-start ${className}`}>
      <span className="text-2xl lg:text-4xl font-bold">{value}</span>
      <span className="text-xs lg:text-sm opacity-80 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};
