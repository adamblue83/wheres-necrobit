import { useState, useRef, useCallback } from 'react'
import type { Level, Target } from '../types/level'
import WinModal from './WinModal'
import HintButton from './HintButton'

interface Props {
  level: Level
  hasNext: boolean
  onComplete: () => void
  onNext: () => void
  onBack: () => void
}

interface Ripple {
  id: number
  x: number
  y: number
  success: boolean
}

interface HintCircle {
  target: Target
  visible: boolean
}

let rippleCounter = 0

export default function PuzzleLevel({ level, hasNext, onComplete, onNext, onBack }: Props) {
  const [foundIds, setFoundIds] = useState<string[]>([])
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [hint, setHint] = useState<HintCircle | null>(null)
  const [won, setWon] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const required = level.targets
  const foundCount = foundIds.length
  const totalCount = required.length

  function getRelativePos(e: React.MouseEvent | React.TouchEvent) {
    const el = imgRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return { x, y, pxX: clientX - rect.left, pxY: clientY - rect.top, w: rect.width }
  }

  function distance(ax: number, ay: number, bx: number, by: number) {
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
  }

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (won) return
    const pos = getRelativePos(e)
    if (!pos) return

    const hit = required.find(t => {
      if (foundIds.includes(t.id)) return false
      return distance(pos.x, pos.y, t.x, t.y) <= t.radius
    })

    const id = ++rippleCounter
    setRipples(prev => [...prev, { id, x: pos.pxX, y: pos.pxY, success: !!hit }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)

    if (hit) {
      const next = [...foundIds, hit.id]
      setFoundIds(next)
      setHint(null)
      if (next.length === totalCount) {
        setTimeout(() => {
          setWon(true)
          onComplete()
        }, 500)
      }
    }
  }, [won, foundIds, required, totalCount, onComplete])

  function showHint(target: Target) {
    setHint({ target, visible: true })
    setTimeout(() => setHint(null), 3000)
  }

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-800/30 bg-purple-950/60">
        <button onClick={onBack} className="text-purple-400 hover:text-purple-200 transition-colors text-xl">←</button>
        <div className="text-center">
          <p className="text-xs text-purple-500 uppercase tracking-wider">{level.world}</p>
          <p className="text-sm font-semibold text-purple-200 leading-tight">{level.title}</p>
        </div>
        <div className="text-sm font-bold text-purple-300">
          {foundCount}/{totalCount}
        </div>
      </div>

      {/* Objective bar */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-purple-950/40 border-b border-purple-800/20">
        {required.map(t => (
          <span
            key={t.id}
            className={`shrink-0 text-xs px-2.5 py-1 rounded-full border transition-all ${
              foundIds.includes(t.id)
                ? 'bg-green-900/40 border-green-500/40 text-green-300 line-through opacity-60'
                : 'bg-purple-900/40 border-purple-500/30 text-purple-300'
            }`}
          >
            {foundIds.includes(t.id) ? '✓ ' : ''}{t.label}
          </span>
        ))}
      </div>

      {/* Image / puzzle area */}
      <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        <div
          ref={imgRef}
          className="relative max-w-full max-h-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl border border-purple-700/30 shadow-xl shadow-purple-950/50"
          style={{ aspectRatio: '4/3', width: '100%', maxWidth: '720px' }}
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          {/* Level illustration — falls back to placeholder if image missing */}
          <LevelImage level={level} />

          {/* Found markers */}
          {required.filter(t => foundIds.includes(t.id)).map(t => (
            <div
              key={t.id}
              className="absolute pointer-events-none"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-10 h-10 rounded-full border-2 border-green-400 bg-green-400/20 flex items-center justify-center text-green-300 text-lg animate-[pulse_1s_ease-out]">
                ✓
              </div>
            </div>
          ))}

          {/* Hint circle */}
          {hint && (
            <div
              className="absolute pointer-events-none animate-pulse"
              style={{
                left: `${hint.target.x}%`,
                top: `${hint.target.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${hint.target.radius * 2}%`,
                height: `${hint.target.radius * 2}%`,
              }}
            >
              <div className="w-full h-full rounded-full border-4 border-yellow-400 bg-yellow-400/10" />
            </div>
          )}

          {/* Tap ripples */}
          {ripples.map(r => (
            <div
              key={r.id}
              className="absolute pointer-events-none"
              style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)' }}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 opacity-0 animate-[ripple_0.6s_ease-out_forwards] ${
                  r.success ? 'border-green-400 bg-green-400/20' : 'border-red-400/60 bg-red-400/10'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-purple-800/30 bg-purple-950/60">
        <HintButton targets={required} foundIds={foundIds} onHint={showHint} />
        <div className="flex gap-1.5">
          {required.map((t, i) => (
            <div
              key={t.id}
              className={`w-3 h-3 rounded-full transition-all ${
                foundIds.includes(t.id) ? 'bg-green-400 scale-110' : 'bg-purple-700'
              }`}
            />
          ))}
        </div>
      </div>

      {won && (
        <WinModal
          levelTitle={level.title}
          hasNext={hasNext}
          onNext={onNext}
          onMenu={onBack}
        />
      )}
    </div>
  )
}

function LevelImage({ level }: { level: Level }) {
  const [failed, setFailed] = useState(false)

  if (!failed) {
    return (
      <img
        src={level.image}
        alt={level.title}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
        draggable={false}
      />
    )
  }

  return <PlaceholderScene levelId={level.id} />
}

// Placeholder scene used when no real image exists yet
function PlaceholderScene({ levelId }: { levelId: string }) {
  const isLevel2 = levelId === 'level-002'

  if (isLevel2) {
    return (
      <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Haunted lab */}
        <rect width="800" height="600" fill="#0d1117" />
        <rect x="0" y="400" width="800" height="200" fill="#111827" />
        {/* Floor tiles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={i * 100} y="400" width="100" height="200" fill={i % 2 === 0 ? '#111827' : '#0f172a'} />
        ))}
        {/* Lab bench */}
        <rect x="50" y="340" width="700" height="60" fill="#1e293b" />
        {/* Beakers */}
        <ellipse cx="150" cy="330" rx="20" ry="10" fill="#6ee7b7" opacity="0.8" />
        <rect x="132" y="290" width="36" height="40" fill="#065f46" opacity="0.8" />
        <ellipse cx="300" cy="330" rx="25" ry="12" fill="#a78bfa" opacity="0.8" />
        <rect x="278" y="280" width="44" height="50" fill="#4c1d95" opacity="0.8" />
        {/* Missing skull area (difference-002) */}
        <text x="430" y="310" fontSize="40" textAnchor="middle" fill="#1e293b">💀</text>
        {/* Window */}
        <rect x="500" y="100" width="200" height="150" fill="#0f172a" stroke="#334155" strokeWidth="4" />
        <line x1="600" y1="100" x2="600" y2="250" stroke="#334155" strokeWidth="2" />
        <line x1="500" y1="175" x2="700" y2="175" stroke="#334155" strokeWidth="2" />
        {/* Moon */}
        <circle cx="560" cy="155" r="30" fill="#fef3c7" opacity="0.6" />
        {/* Green liquid spill (difference-003) */}
        <ellipse cx="640" cy="380" rx="60" ry="20" fill="#34d399" opacity="0.4" />
        {/* Necrobit hidden at 65%, 45% = x:520, y:270 */}
        <text x="520" y="290" fontSize="28" textAnchor="middle" fill="#7c3aed" opacity="0.55">👾</text>
        {/* Shelves */}
        <rect x="0" y="150" width="120" height="10" fill="#1e293b" />
        <rect x="680" y="200" width="120" height="10" fill="#1e293b" />
        {/* Extra beaker on shelf (difference-001) at 30%, 60% = x:240, y:360 */}
        <ellipse cx="240" cy="355" rx="15" ry="8" fill="#f87171" opacity="0.8" />
        <rect x="228" y="325" width="24" height="30" fill="#7f1d1d" opacity="0.8" />
        {/* Cobwebs */}
        <text x="60" y="170" fontSize="24" fill="#374151">🕸️</text>
        <text x="700" y="120" fontSize="24" fill="#374151">🕸️</text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Neon alley night sky */}
      <rect width="800" height="600" fill="#050714" />
      {/* Ground */}
      <rect x="0" y="450" width="800" height="150" fill="#0a0a1a" />
      {/* Puddle reflections */}
      <ellipse cx="200" cy="510" rx="80" ry="15" fill="#1a0a3a" />
      <ellipse cx="600" cy="530" rx="60" ry="12" fill="#0a1a3a" />
      {/* Buildings */}
      <rect x="0" y="80" width="180" height="420" fill="#0d0d2b" />
      <rect x="620" y="50" width="180" height="450" fill="#0a0a22" />
      <rect x="160" y="150" width="120" height="350" fill="#100d2e" />
      {/* Windows */}
      {[100, 180, 260].map(y => [30, 90, 140].map(x => (
        <rect key={`${x}-${y}`} x={x} y={y} width="20" height="30" fill={Math.random() > 0.4 ? '#fbbf24' : '#1e1b4b'} opacity="0.8" />
      )))}
      {[80, 160, 240, 320].map(y => [650, 720, 760].map(x => (
        <rect key={`${x}-${y}`} x={x} y={y} width="20" height="28" fill={Math.random() > 0.5 ? '#60a5fa' : '#1e1b4b'} opacity="0.9" />
      )))}
      {/* Neon signs */}
      <text x="60" y="75" fontSize="18" fill="#f0abfc" style={{ filter: 'drop-shadow(0 0 6px #c026d3)' }}>NOODLES</text>
      {/* Missing sign location (difference-001) at 72%, 25% = x:576, y:150 */}
      <rect x="556" y="130" width="80" height="24" fill="#1a1a2e" stroke="#4c1d95" strokeWidth="1" strokeDasharray="4,2" />
      <text x="596" y="148" fontSize="11" fill="#4c1d95" textAnchor="middle">?</text>
      <text x="200" y="200" fontSize="14" fill="#34d399" style={{ filter: 'drop-shadow(0 0 4px #059669)' }}>CYBER SHOP</text>
      {/* Broken streetlight (difference-002) at 18%, 40% = x:144, y:240 */}
      <rect x="140" y="200" width="8" height="250" fill="#1e293b" />
      <rect x="128" y="200" width="32" height="12" fill="#334155" />
      {/* broken - no light glow */}
      <circle cx="144" cy="196" r="10" fill="#1e293b" />
      {/* Working lights */}
      <rect x="660" y="180" width="8" height="270" fill="#1e293b" />
      <rect x="648" y="180" width="32" height="12" fill="#334155" />
      <circle cx="664" cy="176" r="10" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
      {/* Alley floor details */}
      <line x1="0" y1="450" x2="800" y2="450" stroke="#1e1b4b" strokeWidth="2" />
      {/* Hidden cat (difference-003) at 85%, 70% = x:680, y:420 */}
      <text x="680" y="440" fontSize="20" fill="#6b7280" opacity="0.7">🐱</text>
      {/* Necrobit hidden at 42%, 58% = x:336, y:348 */}
      <text x="336" y="368" fontSize="26" textAnchor="middle" fill="#7c3aed" opacity="0.5">👾</text>
      {/* Fog / atmosphere */}
      <rect x="0" y="350" width="800" height="100" fill="url(#fog)" opacity="0.3" />
      <defs>
        <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f0a2a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0f0a2a" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
