import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((msg, variant = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg, variant }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500)
  }, [])

  return (
  <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[100]">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded-xl text-sm shadow-lg border ${t.variant==='error' ? 'bg-error-500/20 text-error-200 border-error-500/40' : 'bg-success-500/20 text-success-200 border-success-500/40'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
