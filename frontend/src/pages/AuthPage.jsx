import { useState } from 'react'
import Button from '../components/ui/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../components/ui/Toast'
import { useAuth } from '../components/auth/AuthProvider'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [goal, setGoal] = useState('Exam Prep')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const loc = useLocation()
  const { push } = useToast()
  const { login, signup, loading } = useAuth()

  const validate = () => {
    const e = {}
    if (mode==='signup' && !name.trim()) e.name = 'Name is required'
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = 'Valid email required'
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!strong.test(password||'')) e.password = '8+ chars with upper, lower, number'
    if (mode==='signup' && confirm !== password) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length===0
  }

  const onSubmit = async () => {
    if (!validate()) { push('Please fix the form errors', 'error'); return }
    try {
      if (mode==='login') {
        const { user } = await login({ email, password })
        push(`Welcome back, ${user.name}!`)
      } else {
        const { user } = await signup({ name, email, password })
        push(`Account created for ${user.name}`)
      }
      const dest = loc.state?.from || '/dashboard'
      navigate(dest)
    } catch (err) {
      push(err.message || 'Action failed', 'error')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl border border-black/10 p-6 shadow-sm bg-white dark:bg-[#1E293B] dark:border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{mode==='login' ? 'Welcome back' : 'Create account'}</h2>
          <button className="text-sm text-secondary-300 hover:underline" onClick={()=>setMode(m=>m==='login'?'signup':'login')}>
            {mode==='login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
          </button>
        </div>
        <p className="text-grey-600 dark:text-grey-300">{mode==='login' ? 'Sign in to continue' : 'Start your learning journey'}</p>

        <div className="mt-4 grid gap-3">
          {mode==='signup' && (
            <div>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="w-full px-4 py-2 rounded-xl border border-black/10 bg-transparent placeholder:text-grey-500 dark:border-white/10" />
              {errors.name && <p className="text-xs text-error-300 mt-1">{errors.name}</p>}
            </div>
          )}
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 rounded-xl border border-black/10 bg-transparent placeholder:text-grey-500 dark:border-white/10" />
          {errors.email && <p className="text-xs text-error-300 -mt-2">{errors.email}</p>}
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full px-4 py-2 rounded-xl border border-black/10 bg-transparent placeholder:text-grey-500 dark:border-white/10" />
          {errors.password && <p className="text-xs text-error-300 -mt-2">{errors.password}</p>}
          {mode==='signup' && (
            <div>
              <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type="password" placeholder="Confirm Password" className="w-full px-4 py-2 rounded-xl border border-black/10 bg-transparent placeholder:text-grey-500 dark:border-white/10" />
              {errors.confirm && <p className="text-xs text-error-300 mt-1">{errors.confirm}</p>}
            </div>
          )}
          <Button className="w-full" onClick={onSubmit} disabled={loading}>{loading ? 'Please wait…' : (mode==='login' ? 'Sign In' : 'Create Account')}</Button>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2">Choose your goal</p>
      <div className="grid grid-cols-3 gap-3">
            {['Exam Prep', 'Daily Revision', 'Quick Review'].map(g => (
        <button key={g} onClick={() => setGoal(g)} className={`px-3 py-2 rounded-xl border transition ${goal===g ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-200' : 'border-black/10 hover:bg-grey-50 dark:border-white/10 dark:hover:bg-white/5'}`}>{g}</button>
            ))}
            {/* Goal selection is non-functional (mock preference) */}
          </div>
        </div>
      </div>
    </div>
  )
}
