export default function ProgressBar({ value = 0, className = '' }) {
  return (
  <div className={`h-2 rounded-full bg-white/5 overflow-hidden ${className}`}>
      <div
    className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-700 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
