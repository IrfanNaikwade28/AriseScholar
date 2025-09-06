import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Collaboration() {
  const [link] = useState('https://arisescholar.app/share/deck/intro-to-biology')
  const [players] = useState(['You', 'Aisha'])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Share Deck</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-xl border border-grey-200 dark:border-grey-800 p-3 flex items-center justify-between">
            <span className="truncate text-sm">{link}</span>
            <Button variant="secondary" onClick={()=>navigator.clipboard.writeText(link)}>Copy</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Quiz Battle Lobby (mock)</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {players.map(p => <li key={p} className="p-3 rounded-xl bg-grey-50 dark:bg-grey-800/50">{p}</li>)}
          </ul>
          <Button className="mt-3">Start Match</Button>
        </CardContent>
      </Card>
    </div>
  )
}
