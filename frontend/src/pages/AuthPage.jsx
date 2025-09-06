import { useState } from 'react'
import Button from '../components/ui/Button'

export default function AuthPage() {
  const [goal, setGoal] = useState('Exam Prep')

  return (
    <div className="max-w-xl mx-auto">
  <div className="rounded-2xl bg-white dark:bg-grey-900 border border-grey-200 dark:border-grey-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Welcome to AriseScholar</h2>
  <p className="text-grey-600 dark:text-grey-300">Sign in to continue</p>

        <div className="mt-4"> 
          <Button className="w-full" variant="secondary">🔵 Continue with Google (mock)</Button>
        </div>

        <div className="mt-4 grid gap-3">
          <input placeholder="Email" className="w-full px-4 py-2 rounded-xl border border-grey-300 dark:border-grey-700 bg-transparent" />
          <input type="password" placeholder="Password" className="w-full px-4 py-2 rounded-xl border border-grey-300 dark:border-grey-700 bg-transparent" />
          <Button className="w-full">Sign In</Button>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2">Choose your goal</p>
          <div className="grid grid-cols-3 gap-3">
            {['Exam Prep', 'Daily Revision', 'Quick Review'].map(g => (
              <button key={g} onClick={() => setGoal(g)} className={`px-3 py-2 rounded-xl border ${goal===g ? 'border-primary-500 bg-primary-100 dark:bg-primary-500/10' : 'border-grey-300 dark:border-grey-700 hover:bg-grey-50 dark:hover:bg-grey-800'}`}>{g}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
