import { useState, useEffect } from 'react'

interface Progress {
  completedLevels: string[]
  unlockedLevels: string[]
}

const STORAGE_KEY = 'necrobit-progress'
const DEFAULT_FIRST_LEVEL = 'level-001'

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completedLevels: [], unlockedLevels: [DEFAULT_FIRST_LEVEL] }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

export function useProgress(allLevelIds: string[]) {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  function completeLevel(levelId: string) {
    setProgress(prev => {
      const completedLevels = prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId]

      const idx = allLevelIds.indexOf(levelId)
      const nextId = allLevelIds[idx + 1]
      const unlockedLevels =
        nextId && !prev.unlockedLevels.includes(nextId)
          ? [...prev.unlockedLevels, nextId]
          : prev.unlockedLevels

      return { completedLevels, unlockedLevels }
    })
  }

  function resetProgress() {
    const fresh: Progress = { completedLevels: [], unlockedLevels: [DEFAULT_FIRST_LEVEL] }
    setProgress(fresh)
  }

  return {
    completedLevels: progress.completedLevels,
    unlockedLevels: progress.unlockedLevels,
    completeLevel,
    resetProgress,
    hasProgress: progress.completedLevels.length > 0,
  }
}
