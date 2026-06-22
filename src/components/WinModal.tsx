interface Props {
  levelTitle: string
  hasNext: boolean
  onNext: () => void
  onMenu: () => void
}

export default function WinModal({ levelTitle, hasNext, onNext, onMenu }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="bg-purple-950 border border-purple-500/40 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-purple-900/60 animate-[pop_0.25s_ease-out]">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-black text-purple-100 mb-1">You found him!</h2>
        <p className="text-purple-400 text-sm mb-6">{levelTitle} complete</p>
        <div className="text-4xl mb-6">⭐⭐⭐</div>
        <div className="flex flex-col gap-3">
          {hasNext && (
            <button
              onClick={onNext}
              className="w-full py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-400 active:scale-95 transition-all font-bold text-white"
            >
              Next Level →
            </button>
          )}
          <button
            onClick={onMenu}
            className="w-full py-3 rounded-2xl border border-purple-500/40 hover:border-purple-400 active:scale-95 transition-all font-semibold text-purple-300 text-sm"
          >
            Level Select
          </button>
        </div>
      </div>
    </div>
  )
}
