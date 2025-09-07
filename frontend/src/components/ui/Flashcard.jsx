import { useState } from 'react'

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="[perspective:1000px] w-full max-w-xl mx-auto">
      <div
        onClick={() => setFlipped(f => !f)}
        className={`relative h-64 cursor-pointer select-none rounded-2xl border border-black/10 bg-white shadow-sm hover:shadow-md transition-transform duration-500 [transform-style:preserve-3d] dark:border-white/5 dark:bg-[#1E293B] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_8px_24px_rgba(6,182,212,0.15)] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div className="absolute inset-0 p-6 grid place-items-center [backface-visibility:hidden]">
          <p className="text-xl font-semibold text-center dark:text-white">{front}</p>
          <p className="mt-2 text-sm text-grey-600 dark:text-grey-300">Tap to flip</p>
        </div>
        <div className="absolute inset-0 p-6 grid place-items-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="text-xl font-semibold text-center dark:text-white">{back}</p>
          <p className="mt-2 text-sm text-grey-600 dark:text-grey-300">Tap to flip back</p>
        </div>
      </div>
    </div>
  )
}
