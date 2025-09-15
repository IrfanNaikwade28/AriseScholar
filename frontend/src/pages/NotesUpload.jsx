import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import { decks } from '../mockData/studyData'

export default function NotesUpload() {
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  function simulateProcessing() {
    setDone(false)
    setProgress(0)
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setDone(true); }
        return Math.min(100, p + 10)
      })
    }, 300)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Upload Notes</CardTitle></CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5"
            onDragOver={(e)=>e.preventDefault()}
            onDrop={(e)=>{e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f){setFileName(f.name); simulateProcessing();}}}
          >
            <p className="text-grey-300">Drag and drop files here or</p>
            <label className="inline-block mt-3">
              <input type="file" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(f){setFileName(f.name); simulateProcessing();}}} />
              <span className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-secondary-500 cursor-pointer">Choose File</span>
            </label>
            {fileName && <p className="mt-3 text-sm">Selected: {fileName}</p>}
          </div>

          <div className="mt-6">
            <p className="text-sm mb-2 text-grey-300">AI Processing</p>
            <ProgressBar value={progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Generated Study Deck</CardTitle></CardHeader>
        <CardContent>
          {done ? (
            <div className="space-y-3">
              <p>Deck: <strong>{decks[0].title}</strong></p>
              <div className="flex gap-2">
                <Button as="a" href={`/deck/${decks[0].id}`} variant="secondary">View Summaries</Button>
                <Button as="a" href={`/flashcards/${decks[0].id}`}>Practice Flashcards</Button>
                <Button as="a" href={`/quiz/${decks[0].id}`} variant="success">Start Quiz</Button>
              </div>
            </div>
          ) : (
            <p className="text-grey-300">No output yet. Upload a file to generate.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
