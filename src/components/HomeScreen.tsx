interface Props {
  hasProgress: boolean
  onStart: () => void
  onContinue: () => void
}

export default function HomeScreen({ hasProgress, onStart, onContinue }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center select-none relative"
      style={{
        backgroundImage: 'url(/home-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-2">
          <div className="text-7xl mb-4">👾</div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
            Where's<br />
            <span className="text-purple-300">Necrobit?</span>
          </h1>
          <p className="mt-3 text-purple-200/80 text-sm sm:text-base max-w-xs mx-auto drop-shadow">
            Find the sneaky skeleton hidden in every scene. How fast can you spot him?
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          {hasProgress ? (
            <>
              <button
                onClick={onContinue}
                className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 active:scale-95 transition-all font-bold text-white text-lg shadow-lg shadow-purple-900/60"
              >
                Continue
              </button>
              <button
                onClick={onStart}
                className="w-full py-3 rounded-2xl border border-white/30 hover:border-white/60 bg-black/20 active:scale-95 transition-all font-semibold text-purple-200 text-base backdrop-blur-sm"
              >
                Level Select
              </button>
            </>
          ) : (
            <button
              onClick={onStart}
              className="w-full py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 active:scale-95 transition-all font-bold text-white text-lg shadow-lg shadow-purple-900/60"
            >
              Play
            </button>
          )}
        </div>

        <p className="mt-12 text-white/30 text-xs">Tap to find · No account needed</p>
      </div>
    </div>
  )
}
