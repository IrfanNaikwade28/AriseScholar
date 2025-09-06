import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { userProfile, leaderboard } from '../mockData/profile'
import { studyGroups } from '../mockData/studyData'

export default function Profile() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader><CardTitle>Player Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold">{userProfile.name}</div>
          <div>Level {userProfile.level} • {userProfile.xp} XP • {userProfile.streak} day streak</div>
          <div>Cards Mastered: {userProfile.cardsMastered}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {userProfile.badges.map(b => <span key={b} className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs">{b}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {leaderboard.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="font-semibold">#{i+1} {p.name}</span>
                <span>{p.xp} XP • L{p.level}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader><CardTitle>Study Groups</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {studyGroups.map((g)=>(
            <div key={g.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold">{g.name}</div>
              <div className="text-sm text-slate-500">{g.members} members</div>
              <a href="#" className="text-indigo-600 text-sm hover:underline">Open (mock)</a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
