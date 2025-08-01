import { useState, useEffect } from 'react'

export const useGameAnimation = (guesses: any[]) => {
  const [visibleRows, setVisibleRows] = useState<string[]>([])
  const [animatedCells, setAnimatedCells] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (guesses.length > visibleRows.length) {
      setTimeout(() => {
        const newGuessId = guesses[0].guessId
        setVisibleRows([newGuessId, ...visibleRows])
      }, 200)
    }
  }, [guesses, visibleRows])

  const handleAnimationEnd = (guessId: string, cellIndex: number) => {
    setAnimatedCells(prev => ({
      ...prev,
      [`${guessId}-${cellIndex}`]: 1,
    }))
  }

  return { visibleRows, setVisibleRows, animatedCells, handleAnimationEnd }
}
