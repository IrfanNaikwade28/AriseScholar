import { createContext, useContext, useMemo, useState } from 'react'
import { getCurrentUser, getToken, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../../services/mockApi'

const AuthCtx = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [token, setToken] = useState(() => getToken())
  const [loading, setLoading] = useState(false)

  const login = async (payload) => {
    setLoading(true)
    try {
      const { user, token } = await apiLogin(payload)
      setUser(user)
      setToken(token)
      return { user }
    } finally { setLoading(false) }
  }

  const signup = async (payload) => {
    setLoading(true)
    try {
      const { user, token } = await apiSignup(payload)
      setUser(user)
      setToken(token)
      return { user }
    } finally { setLoading(false) }
  }

  const logout = () => { apiLogout(); setUser(null); setToken(null) }

  const value = useMemo(()=>({ user, token, loading, login, signup, logout }), [user, token, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
