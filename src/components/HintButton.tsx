import { useState } from 'react'
import type { Target } from '../types/level'

interface Props {
  targets: Target[]
  foundIds: string[]
  onHint: (target: Target) => void
}

export default function HintButton({ targets, foundIds, onHint }: Props) {
  const [used, setUsed] = useState(false)

  const unfound = targets.filter(t => !foundIds.includes(t.id))

  function handleHint() {
    if (unfound.length === 0) return
    const pick = unfound[Math.floor(Math.random() * unfound.length)]
    onHint(pick)
    setUsed(true)
    setTimeout(() => setUsed(false), 3000)
  }

  return (
    <button
      onClick={handleHint}
      disabled={unfound.length === 0 || used}
      className={`
        px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95
        ${used || unfound.length === 0
          ? 'bg-purple-900/30 text-purple-600 cursor-not-allowed'
          : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30'}
      `}
    >
      {used ? '💡 Look over there…' : '💡 Hint'}
    </button>
  )
}
