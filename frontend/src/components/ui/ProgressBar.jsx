export default function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={`h-2 rounded-full bg-grey-200 dark:bg-grey-800 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-secondary-500 via-info-500 to-success-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
