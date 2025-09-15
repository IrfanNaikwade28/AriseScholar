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
        <div className="rounded-t-xl bg-gradient-to-t from-primary-500 via-secondary-500 to-primary-700" style={{ height: `${(v/520)*100}%` }} />
        <div className="text-xs text-center mt-1 text-grey-300">D{i+1}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Streak</CardTitle></CardHeader>
        <CardContent>
          <div className="text-4xl font-extrabold text-white">{progressData.streak}🔥</div>
          <p className="text-grey-300">Keep it going!</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>Accuracy by Subject</CardTitle></CardHeader>
        <CardContent className="space-y-3">
      {progressData.accuracyBySubject.map((s)=> (
            <div key={s.subject}>
              <div className="flex justify-between text-sm"><span>{s.subject}</span><span>{s.accuracy}%</span></div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{width: `${s.accuracy}%`}} /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm space-y-2 text-grey-300">
            <li>Revise cell organelles; missed 2 questions last session.</li>
            <li>Short 10-min review boosts retention by 20%.</li>
            <li>Try a mixed quiz to balance topics.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
