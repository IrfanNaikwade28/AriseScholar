export default function ProgressBar({ value = 0, className = '' }) {
  return (
    <div className={`h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-teal-400 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
