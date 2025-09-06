import { useMemo, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { decks } from '../mockData/studyData'
import Flashcard from '../components/ui/Flashcard'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

export default function FlashcardMode() {
  const { deckId } = useParams()
  const deck = decks.find(d => d.id === deckId) || decks[0]
  const [i, setI] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const total = deck.flashcards.length
  const pct = Math.round(((i) / total) * 100)
  const card = useMemo(() => deck.flashcards[i], [i, deck])

  function next(markCorrect) {
    setI(v => Math.min(total, v + 1))
    if (markCorrect) setCorrect(v => v + 1); else setIncorrect(v => v + 1)
  }

  const finished = i >= total

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
  <NavLink to={`/deck/${deck.id}`} className="text-sm text-grey-500 hover:underline">← Back to {deck.title}</NavLink>
        <div className="w-64"><ProgressBar value={pct} /></div>
      </div>

      {finished ? (
  <div className="text-center rounded-2xl border border-grey-200 dark:border-grey-800 p-8">
          <h3 className="text-2xl font-bold">Great job! 🎉</h3>
          <p className="mt-2">You knew {correct}/{total} cards. XP earned: {correct * 10}</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={()=>{setI(0); setCorrect(0); setIncorrect(0)}}>Restart</Button>
            <Button as="a" href={`/quiz/${deck.id}`} variant="success">Try Quiz</Button>
          </div>
        </div>
      ) : (
        <>
          <Flashcard front={card.q} back={card.a} />
          <div className="flex justify-center gap-4">
            <Button variant="danger" onClick={()=>next(false)}>I Don’t Know</Button>
            <Button variant="success" onClick={()=>next(true)}>I Know</Button>
          </div>
          <p className="text-center text-sm text-grey-500">{i+1} / {total} • ✅ {correct} ❌ {incorrect}</p>
        </>
      )}
    </div>
  )
}
