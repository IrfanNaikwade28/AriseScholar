import { useParams, NavLink } from 'react-router-dom'
import { decks } from '../mockData/studyData'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function StudyDeck() {
  const { deckId } = useParams()
  const deck = decks.find(d => d.id === deckId) || decks[0]

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{deck.title} — Study Deck</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Tab to={`/deck/${deck.id}`} active>Summaries</Tab>
            <Tab to={`/flashcards/${deck.id}`}>Flashcards</Tab>
            <Tab to={`/quiz/${deck.id}`}>Quizzes</Tab>
          </div>
          <ul className="mt-4 list-disc pl-6 space-y-2">
            {deck.summaries.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function Tab({ to, children, active }) {
  return (
    <NavLink to={to} className={`px-3 py-1.5 rounded-xl border ${active ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{children}</NavLink>
  )
}
