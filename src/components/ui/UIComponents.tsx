/**
 * Reusable UI components
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className='text-center py-10'>
      <div className={`inline-block ${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-[var(--primary)] border-r-transparent`}></div>
      {message && <p className='mt-4 text-[var(--text)] opacity-70'>{message}</p>}
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorMessage({ title = '⚠️ Error', message, actionText, onAction }: ErrorMessageProps) {
  return (
    <div className='bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-500'>
      <p className='font-semibold text-lg'>{title}</p>
      <p className='text-sm mt-2'>{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className='mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors'
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📭', title, message, actionText, onAction }: EmptyStateProps) {
  return (
    <div className='text-center py-20 bg-[var(--menucard)] rounded-lg'>
      <div className='text-6xl mb-4'>{icon}</div>
      <p className='text-[var(--text)] text-xl font-semibold'>{title}</p>
      <p className='text-[var(--text)] opacity-70 mt-2'>{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className='mt-6 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold'
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

interface EventCardProps {
  title: string;
  description: string;
  location: string;
  date: string;
  maxAttendees: number;
  onViewDetails?: () => void;
  onJoin?: () => void;
}

export function EventCard({ title, description, location, date, maxAttendees, onViewDetails, onJoin }: EventCardProps) {
  return (
    <div className="bg-[var(--menucard)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
        <p className="text-[var(--text)] opacity-80 mb-4 line-clamp-3">{description}</p>
        <div className="space-y-2 text-sm text-[var(--text)] opacity-70">
          <p className="flex items-center gap-2">
            <span>📍</span>
            <span>{location}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📅</span>
            <span>{date}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>👥</span>
            <span>Max {maxAttendees} attendees</span>
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 bg-[var(--primary)] text-white py-2 rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              View Details
            </button>
          )}
          {onJoin && (
            <button
              onClick={onJoin}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
