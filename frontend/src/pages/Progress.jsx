import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { progressData } from '../mockData/studyData'

export default function Progress() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader><CardTitle>XP Growth</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {progressData.xpHistory.map((v, i) => (
              <div key={i} className="flex-1">
                <div className="rounded-t-xl bg-gradient-to-t from-indigo-500 via-fuchsia-500 to-teal-400" style={{ height: `${(v/520)*100}%` }} />
                <div className="text-xs text-center mt-1 text-slate-500">D{i+1}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Streak</CardTitle></CardHeader>
        <CardContent>
          <div className="text-4xl font-extrabold">{progressData.streak}🔥</div>
          <p className="text-slate-500">Keep it going!</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Accuracy by Subject</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {progressData.accuracyBySubject.map((s)=> (
            <div key={s.subject}>
              <div className="flex justify-between text-sm"><span>{s.subject}</span><span>{s.accuracy}%</span></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: `${s.accuracy}%`}} /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm space-y-2 text-slate-600 dark:text-slate-300">
            <li>Revise cell organelles; missed 2 questions last session.</li>
            <li>Short 10-min review boosts retention by 20%.</li>
            <li>Try a mixed quiz to balance topics.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
