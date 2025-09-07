import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/notes", label: "Notes", icon: "📄" },
  { to: "/deck/intro-to-biology", label: "Flashcards", icon: "🃏" },
  { to: "/quiz/intro-to-biology", label: "Quizzes", icon: "🧠" },
  { to: "/progress", label: "Progress", icon: "📈" },
  { to: "/profile", label: "Profile", icon: "👤" },
  { to: "/collab", label: "Collab", icon: "🤝" },
];

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => {
    const t = localStorage.getItem("theme");
    return t ? t === "dark" : true; // default to dark when unset
  });
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="h-screen bg-white text-grey-900 dark:bg-[#0F172A] dark:text-grey-300">
      {/* Fixed top bar */}
      <header className="fixed top-0 inset-x-0 z-40 h-14 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#0F172A]/60 border-b border-black/10 dark:border-white/5">
        <div className="mx-auto max-w-7xl h-full px-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 text-white shadow-md">A</span>
            <span className="text-white">AriseScholar</span>
          </NavLink>
          <div className="flex items-center gap-2">
            <button className="md:hidden px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5" onClick={()=>setOpen(true)}>☰</button>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-grey-200">Hi, {user.name}</span>
                <button onClick={()=>{logout(); navigate('/')}} className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5">Logout</button>
              </div>
            ) : (
              <NavLink to="/auth" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-primary-500 text-white hover:bg-secondary-500 transition">Sign in</NavLink>
            )}
            <button onClick={() => setDark((v) => !v)} className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition">
              {dark ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* Fixed full-height sidebar */}
      <aside className="hidden md:block fixed left-0 top-14 bottom-0 w-64">
        <div className="h-full p-3 flex flex-col">
          <nav className="rounded-2xl bg-white dark:bg-[#0F172A] border border-black/10 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] p-3 flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-xl transition border border-transparent ` +
                      ((isActive || location.pathname.startsWith(item.to))
                        ? ` bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-300 dark:border-primary-500/20`
                        : ` hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-500/5 dark:hover:text-primary-200`)
                    }
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-3 rounded-2xl p-4 bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 text-white shadow-md">
            <p className="text-sm opacity-90">Tip</p>
            <p className="font-semibold">Study Smarter, Rise Higher.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-[#0F172A] border-r border-black/10 dark:border-white/5 p-3">
            <div className="flex items-center justify-between">
              <div className="font-bold">Menu</div>
              <button className="px-2 py-1 rounded-lg border border-black/10 dark:border-white/5" onClick={()=>setOpen(false)}>✕</button>
            </div>
            <ul className="mt-3 space-y-2">
              {navItems.map((item)=>(
                <li key={item.to}>
                  <NavLink to={item.to} onClick={()=>setOpen(false)} className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl transition ` +
                    ((isActive || location.pathname.startsWith(item.to))
                      ? ` bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300`
                      : ` hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-500/5 dark:hover:text-primary-200`)}>
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2">
              {user ? (
                <button onClick={()=>{setOpen(false); logout(); navigate('/')}} className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/5 w-full">Logout</button>
              ) : (
                <NavLink to="/auth" onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-center w-full">Sign in</NavLink>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content area with internal scroll */}
  <main className="pt-14 md:pl-64 h-full">
    <div className="h-full overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
