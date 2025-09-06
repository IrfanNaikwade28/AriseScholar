export default function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2',
    secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2',
    success: 'bg-teal-600 text-white hover:bg-teal-500 px-4 py-2',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 px-4 py-2',
  }
  const CompEl = Comp
  return <CompEl className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</CompEl>
}
