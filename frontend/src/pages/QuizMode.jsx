import { useMemo, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { decks } from '../mockData/studyData'
import Timer from '../components/ui/Timer'
import Button from '../components/ui/Button'
import { submitQuiz } from '../services/mockApi'
import { useToast } from '../components/ui/Toast'

export default function QuizMode() {
  const { deckId } = useParams()
  const deck = decks.find(d => d.id === deckId) || decks[0]
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const total = deck.quiz.length
  const q = useMemo(()=> deck.quiz[i], [i, deck])
  const [showFeedback, setShowFeedback] = useState(false)
  const [selected, setSelected] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { push } = useToast()
  const finished = i >= total

  function submitAnswer() {
    if (selected == null) return
    const correct = selected === q.answer
    setAnswers(a => [...a, correct])
    setShowFeedback(true)
  }

  async function next() {
    setShowFeedback(false)
    setSelected(null)
    const prev = i
    setI(v => v + 1)
    // If moving past last question, finalize with server
    if (prev === total - 1) {
      try {
        setSubmitting(true); setError('')
        const result = await submitQuiz(deck.id, answers)
        setServerScore(result)
        push(`Quiz submitted — +${result.xpEarned} XP`)
      } catch (e) {
        setError(e.message || 'Failed to submit quiz')
        push('Failed to submit quiz (mock)', 'error')
      } finally { setSubmitting(false) }
    }
  }

  const computedAccuracy = finished ? Math.round((answers.filter(Boolean).length / total) * 100) : 0
  const [serverScore, setServerScore] = useState(null)

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <NavLink to={`/deck/${deck.id}`} className="text-sm text-grey-600 hover:underline dark:text-grey-300">← Back to {deck.title}</NavLink>
        {!finished && <div className="w-64"><Timer seconds={45} onEnd={submitAnswer} /></div>}
      </div>

      {finished ? (
        <div className="text-center rounded-2xl border border-black/10 p-8 bg-white dark:border-white/5 dark:bg-white/5">
          <h3 className="text-2xl font-bold">Quiz Complete 🎉</h3>
          <p className="mt-2">Accuracy: {(serverScore?.accuracy ?? computedAccuracy)}% — XP earned: {serverScore?.xpEarned ?? (answers.filter(Boolean).length * 20)}</p>
          <p className="mt-2 text-grey-600 dark:text-grey-300">Focus more on cellular respiration and terminology.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={()=>{setI(0); setAnswers([])}}>Retry</Button>
            <Button as="a" href={`/flashcards/${deck.id}`}>Review Flashcards</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 p-6 bg-white dark:border-white/5 dark:bg-[#1E293B]">
          <h3 className="text-lg font-semibold dark:text-white">Q{i+1}. {q.question}</h3>
          {error && <div className="mt-2 px-3 py-2 rounded-xl border border-error-500/40 bg-error-500/10 text-error-200">{error}</div>}
          <div className="mt-4 grid gap-3">
            {q.options.map((opt, idx) => (
              <label key={idx} className={`px-4 py-3 rounded-xl border cursor-pointer transition ${selected===idx ? 'border-primary-500 bg-primary-500/10' : 'border-black/10 hover:bg-grey-50 dark:border-white/10 dark:hover:bg-white/5'}`}>
                <input type="radio" name="opt" className="mr-2" checked={selected===idx} onChange={()=>setSelected(idx)} />
                {opt}
              </label>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            {!showFeedback ? (
              <Button onClick={submitAnswer} disabled={selected==null || submitting}>{submitting ? 'Submitting…' : 'Submit'}</Button>
            ) : (
              <>
                <div className={`px-3 py-2 rounded-xl border border-black/10 dark:border-transparent ${selected===q.answer ? 'bg-success-500/10 text-success-300' : 'bg-error-500/10 text-error-300'}`}>
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
