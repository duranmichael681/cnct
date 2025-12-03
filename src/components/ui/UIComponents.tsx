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
