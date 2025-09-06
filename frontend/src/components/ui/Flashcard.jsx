import { useState } from 'react'

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="[perspective:1000px] w-full max-w-xl mx-auto">
      <div
        onClick={() => setFlipped(f => !f)}
  className={`relative h-64 cursor-pointer select-none rounded-2xl border border-grey-200 dark:border-grey-800 bg-white dark:bg-grey-900 shadow-md transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
  <div className="absolute inset-0 p-6 grid place-items-center [backface-visibility:hidden]">
          <p className="text-xl font-semibold text-center">{front}</p>
          <p className="mt-2 text-sm text-grey-500">Tap to flip</p>
        </div>
  <div className="absolute inset-0 p-6 grid place-items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-xl font-semibold text-center">{back}</p>
          <p className="mt-2 text-sm text-grey-500">Tap to flip back</p>
        </div>
      </div>
    </div>
  )
}
