import { useCallback } from 'react'
import type { ItemOption } from './useGameState'
import winSound from '../assets/LegendaryDrop.mp3'
import { v4 as uuidv4 } from 'uuid'

interface UseGameLogicProps {
  guesses: any[]
  setGuesses: (fn: (prev: any[]) => any[]) => void
  setSelected: (option: ItemOption | null) => void
  setDuplicateMessage: (msg: string | null) => void
  setLives: (fn: (prev: number) => number) => void
  isGameWon: boolean
  isGameLost: boolean
  isInFFYL: boolean
}

export const useGameLogic = ({
  guesses,
  setGuesses,
  setSelected,
  setDuplicateMessage,
  setLives,
  isGameWon,
  isGameLost,
  isInFFYL
}: UseGameLogicProps) => {
  
  const checkItem = useCallback(async (option: ItemOption | null) => {
    if (!option || isGameWon || isGameLost) return
    
    if (guesses.some(guess => guess.selected.item.id === option.item.id)) {
      setDuplicateMessage("THIS ITEM HAS ALREADY BEEN GUESSED!")
      setSelected(null)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedItem: option.item })
      })

      const data = await res.json()

      setGuesses(prev => {
        const newGuesses = [{ selected: option, result: data, guessId: uuidv4() }, ...prev]
        return newGuesses
      })
      
      setSelected(null)
      
      if (!data.isCorrect && !isInFFYL) {
        setLives(prev => prev - 1)
      }

      if (data.isCorrect) {
        const audio = new Audio(winSound)
        audio.play().catch(err => console.error('Error playing win sound:', err))
      }

    } catch (err) {
      console.error('Error checking item:', err)
    }
  }, [guesses, isGameWon, isGameLost, isInFFYL, setGuesses, setSelected, setDuplicateMessage, setLives])

  const handleSelect = useCallback((option: ItemOption | null) => {
    setSelected(option)
    checkItem(option)
  }, [setSelected, checkItem])

  return {
    checkItem,
    handleSelect
  }
}