export default function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    // Solid emerald with cyan hover, white text + glow
  primary: 'bg-primary-500 text-white hover:bg-secondary-500 px-4 py-2 shadow-sm hover:shadow-md',
    // Subtle dark secondary with glass glow
  secondary: 'bg-white hover:bg-grey-50 text-grey-900 border border-black/10 px-4 py-2 shadow-sm hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/5',
    // Ghost button
  ghost: 'text-grey-700 hover:text-grey-900 hover:bg-grey-50 px-3 py-2 dark:text-grey-300 dark:hover:text-white dark:hover:bg-white/5',
    success: 'bg-success-500 text-white hover:bg-success-700 px-4 py-2',
    danger: 'bg-error-500 text-white hover:bg-error-700 px-4 py-2',
  }
  const CompEl = Comp
  return <CompEl className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</CompEl>
}
