export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-grey-900 border border-grey-200 dark:border-grey-800 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return <div className={`p-4 pb-2 ${className}`}>{children}</div>
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
}

export function CardContent({ className = '', children }) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>
}
