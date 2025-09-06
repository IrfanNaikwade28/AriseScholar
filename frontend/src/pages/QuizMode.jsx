import { useMemo, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { decks } from '../mockData/studyData'
import Timer from '../components/ui/Timer'
import Button from '../components/ui/Button'

export default function QuizMode() {
  const { deckId } = useParams()
  const deck = decks.find(d => d.id === deckId) || decks[0]
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const total = deck.quiz.length
  const q = useMemo(()=> deck.quiz[i], [i, deck])
  const [showFeedback, setShowFeedback] = useState(false)
  const [selected, setSelected] = useState(null)
  const finished = i >= total

  function submitAnswer() {
    if (selected == null) return
    const correct = selected === q.answer
    setAnswers(a => [...a, correct])
    setShowFeedback(true)
  }

  function next() {
    setShowFeedback(false)
    setSelected(null)
    setI(v => v + 1)
  }

  const accuracy = finished ? Math.round((answers.filter(Boolean).length / total) * 100) : 0

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <NavLink to={`/deck/${deck.id}`} className="text-sm text-slate-500 hover:underline">← Back to {deck.title}</NavLink>
        {!finished && <div className="w-64"><Timer seconds={45} onEnd={submitAnswer} /></div>}
      </div>

      {finished ? (
        <div className="text-center rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <h3 className="text-2xl font-bold">Quiz Complete 🎉</h3>
          <p className="mt-2">Accuracy: {accuracy}% — XP earned: {answers.filter(Boolean).length * 20}</p>
          <p className="mt-2 text-slate-500">Focus more on cellular respiration and terminology.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={()=>{setI(0); setAnswers([])}}>Retry</Button>
            <Button as="a" href={`/flashcards/${deck.id}`}>Review Flashcards</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="text-lg font-semibold">Q{i+1}. {q.question}</h3>
          <div className="mt-4 grid gap-3">
            {q.options.map((opt, idx) => (
              <label key={idx} className={`px-4 py-3 rounded-xl border cursor-pointer ${selected===idx ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <input type="radio" name="opt" className="mr-2" checked={selected===idx} onChange={()=>setSelected(idx)} />
                {opt}
              </label>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            {!showFeedback ? (
              <Button onClick={submitAnswer} disabled={selected==null}>Submit</Button>
            ) : (
              <>
                <div className={`px-3 py-2 rounded-xl ${selected===q.answer ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                  {selected===q.answer ? 'Correct!' : 'Wrong.'} {q.explanation}
                </div>
                <Button variant="secondary" onClick={next}>Next</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
