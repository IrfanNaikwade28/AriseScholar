import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/notes', label: 'Notes', icon: '📄' },
  { to: '/deck/intro-to-biology', label: 'Flashcards', icon: '🃏' },
  { to: '/quiz/intro-to-biology', label: 'Quizzes', icon: '🧠' },
  { to: '/progress', label: 'Progress', icon: '📈' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/collab', label: 'Collab', icon: '🤝' },
]

export default function RootLayout() {
  const location = useLocation()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-teal-400 text-white shadow-md">A</span>
            AriseScholar
          </NavLink>
          <div className="flex items-center gap-3">
            <NavLink to="/auth" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition">Sign in</NavLink>
            <button onClick={() => setDark(v => !v)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              {dark ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="md:sticky md:top-20 h-max">
          <nav className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-xl transition ${isActive || location.pathname.startsWith(item.to) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 rounded-2xl p-4 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-teal-400 text-white shadow-md">
            <p className="text-sm opacity-90">Tip</p>
            <p className="font-semibold">Study Smarter, Rise Higher.</p>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AriseScholar — Made for learners.
      </footer>
    </div>
  )
}
