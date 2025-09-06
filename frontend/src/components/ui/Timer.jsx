import { useEffect, useRef, useState } from 'react'

export default function Timer({ seconds = 60, onEnd }) {
  const [time, setTime] = useState(seconds)
  const endedRef = useRef(false)

  useEffect(() => {
    setTime(seconds)
    endedRef.current = false
  }, [seconds])

  useEffect(() => {
    if (time <= 0) {
      if (!endedRef.current) {
        endedRef.current = true
        onEnd && onEnd()
      }
      return
    }
    const id = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [time, onEnd])

  const pct = Math.max(0, Math.min(100, (time / seconds) * 100))
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400">
        <span>Time</span>
        <span>{time}s</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
