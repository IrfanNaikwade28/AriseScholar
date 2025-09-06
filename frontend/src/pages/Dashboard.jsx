import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import { userProfile, activityFeed } from '../mockData/profile'
import { decks } from '../mockData/studyData'

export default function Dashboard() {
  const nextLevelXP = 6000
  const pct = Math.round((userProfile.xp / nextLevelXP) * 100)

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {userProfile.name}! 🎓</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Stat label="XP" value={userProfile.xp} />
            <Stat label="Level" value={userProfile.level} />
            <Stat label="Streak" value={`${userProfile.streak} days`} />
            <Stat label="Cards Mastered" value={userProfile.cardsMastered} />
          </div>
          <div className="mt-4">
            <ProgressBar value={pct} />
            <p className="text-xs text-grey-500 mt-1">{pct}% to next level</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activityFeed.map(a => (
                <li key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-grey-50 dark:bg-grey-800/50">
                  <span>{a.text}</span>
                  <span className="text-xs text-grey-500">{a.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Start</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
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
  <div className="rounded-xl border border-grey-200 dark:border-grey-800 p-4">
  <div className="text-sm text-grey-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
