import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import { userProfile as profileDefault, activityFeed } from '../mockData/profile'
import { getCurrentUser } from '../services/mockApi'
import { decks } from '../mockData/studyData'

export default function Dashboard() {
  const current = getCurrentUser()
  const merged = current ? { ...profileDefault, ...current } : profileDefault
  const nextLevelXP = 6000
  const pct = Math.round((merged.xp / nextLevelXP) * 100)

  return (
  <div className="grid gap-6 h-full grid-rows-[auto,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {merged.name}! 🎓</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Stat label="XP" value={merged.xp} />
            <Stat label="Level" value={merged.level} />
            <Stat label="Streak" value={`${merged.streak} days`} />
            <Stat label="Cards Mastered" value={merged.cardsMastered} />
          </div>
          <div className="mt-4">
            <ProgressBar value={pct} />
            <p className="text-xs text-grey-600 dark:text-grey-300 mt-1">{pct}% to next level</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 h-full">
        <Card className="md:col-span-2 h-full">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="h-[calc(100%-3.5rem)] overflow-y-auto">
            <ul className="space-y-3">
              {activityFeed.map(a => (
                <li key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-grey-50 dark:bg-white/5">
                  <span>{a.text}</span>
                  <span className="text-xs text-grey-500 dark:text-grey-300">{a.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader><CardTitle>Quick Start</CardTitle></CardHeader>
          <CardContent className="grid gap-3 h-[calc(100%-3.5rem)] content-start">
            <Button as="a" href="/notes" variant="secondary">Upload Notes</Button>
            <Button as="a" href={`/flashcards/${decks[0].id}`}>Practice Flashcards</Button>
            <Button as="a" href={`/quiz/${decks[0].id}`} variant="success">Take a Quiz</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 p-4 bg-white/5">
      <div className="text-sm text-grey-300">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )
}
