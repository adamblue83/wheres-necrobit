import { useState } from 'react'
import levelsData from './data/levels.json'
import type { Level } from './types/level'
import { useProgress } from './hooks/useProgress'
import HomeScreen from './components/HomeScreen'
import LevelSelect from './components/LevelSelect'
import PuzzleLevel from './components/PuzzleLevel'

const levels = levelsData as Level[]
const levelIds = levels.map(l => l.id)

type Screen = 'home' | 'select' | 'level'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activeLevelId, setActiveLevelId] = useState<string>(levelIds[0])
  const { completedLevels, unlockedLevels, completeLevel, hasProgress } = useProgress(levelIds)

  const activeLevel = levels.find(l => l.id === activeLevelId)!
  const activeLevelIdx = levelIds.indexOf(activeLevelId)
  const nextLevelId = levelIds[activeLevelIdx + 1]

  function openLevel(id: string) {
    setActiveLevelId(id)
    setScreen('level')
  }

  function handleContinue() {
    const lastUnlocked = [...unlockedLevels].reverse().find(id => !completedLevels.includes(id))
    if (lastUnlocked) {
      openLevel(lastUnlocked)
    } else {
      setScreen('select')
    }
  }

  function handleComplete() {
    completeLevel(activeLevelId)
  }

  function handleNext() {
    if (nextLevelId) openLevel(nextLevelId)
    else setScreen('select')
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen
          hasProgress={hasProgress}
          onStart={() => setScreen('select')}
          onContinue={handleContinue}
        />
      )}
      {screen === 'select' && (
        <LevelSelect
          levels={levels}
          completedLevels={completedLevels}
          unlockedLevels={unlockedLevels}
          onSelect={openLevel}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'level' && (
        <PuzzleLevel
          key={activeLevelId}
          level={activeLevel}
          hasNext={!!nextLevelId}
          onComplete={handleComplete}
          onNext={handleNext}
          onBack={() => setScreen('select')}
        />
      )}
    </>
  )
}
