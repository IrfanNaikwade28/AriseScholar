export default function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-700 px-4 py-2',
    secondary: 'bg-grey-100 dark:bg-grey-800 hover:bg-grey-200 dark:hover:bg-grey-700 text-grey-900 dark:text-grey-100 px-4 py-2',
    ghost: 'hover:bg-grey-100 dark:hover:bg-grey-800 text-grey-700 dark:text-grey-200 px-3 py-2',
    success: 'bg-success-500 text-white hover:bg-success-700 px-4 py-2',
    danger: 'bg-error-500 text-white hover:bg-error-700 px-4 py-2',
  }
  const CompEl = Comp
  return <CompEl className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</CompEl>
}
