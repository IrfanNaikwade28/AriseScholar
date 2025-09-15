export function Card({ className = '', children }) {
  return (
  <div className={`rounded-2xl bg-white border border-black/10 shadow-sm hover:shadow-md dark:bg-[#1E293B] dark:border-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_0_0_1px_rgba(6,182,212,0.12),0_10px_30px_rgba(0,0,0,0.45)] transition-shadow ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`p-4 pb-2 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-lg font-semibold dark:text-white ${className}`}>{children}</h3>
}

export function CardContent({ className = '', children }) {
  return <div className={`p-4 pt-0 text-grey-700 dark:text-grey-300 ${className}`}>{children}</div>
}
