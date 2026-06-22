import type { Level } from '../types/level'

interface Props {
  levels: Level[]
  completedLevels: string[]
  unlockedLevels: string[]
  onSelect: (levelId: string) => void
  onBack: () => void
}

const WORLD_ICONS: Record<string, string> = {
  'Cyber City': '🌆',
  'Haunted Lab': '🧪',
  'Space Station': '🚀',
  'Ancient Ruins': '🏛️',
  'Toy Store': '🧸',
}

export default function LevelSelect({ levels, completedLevels, unlockedLevels, onSelect, onBack }: Props) {
  return (
    <div className="flex flex-col min-h-dvh px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-200 transition-colors text-2xl leading-none"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-purple-200">Levels</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto w-full">
        {levels.map((level, i) => {
          const isUnlocked = unlockedLevels.includes(level.id)
          const isCompleted = completedLevels.includes(level.id)
          const icon = WORLD_ICONS[level.world] ?? '🔍'

          return (
            <button
              key={level.id}
              onClick={() => isUnlocked && onSelect(level.id)}
              disabled={!isUnlocked}
              className={`
                relative flex flex-col items-center justify-center rounded-2xl p-4 aspect-square
                transition-all active:scale-95
                ${isUnlocked
                  ? 'bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer'
                  : 'bg-purple-950/40 border border-purple-800/20 cursor-not-allowed opacity-40'}
              `}
            >
              <span className="text-3xl mb-1">{isUnlocked ? icon : '🔒'}</span>
              <span className="text-xs font-semibold text-purple-300 text-center leading-tight">
                {level.title.replace('Necrobit in the ', '').replace('Necrobit in ', '')}
              </span>
              <span className="text-[10px] text-purple-500 mt-1">Level {i + 1}</span>
              {isCompleted && (
                <span className="absolute top-2 right-2 text-base">⭐</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
