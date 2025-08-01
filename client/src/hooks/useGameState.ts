import { useState} from 'react'
import type { Item } from '../types'
import type { ResultTristateCheck } from '../../../server/src/index'

export interface ItemOption {
  value: number
  label: string
  item: Item
}

interface GuessResult {
  selected: ItemOption
  result: {
    isCorrect: boolean
    isRarityCorrect: ResultTristateCheck
    isTypeCorrect: ResultTristateCheck
    isManufacturerCorrect: ResultTristateCheck
    isGameCorrect: ResultTristateCheck
    isElementsCorrect: ResultTristateCheck
    isDLCCorrect: ResultTristateCheck
    dailyId: number
    dailyImage: string
    dailyName: string
  }
  guessId: string
}

export const useGameState = () => {
  const [options, setOptions] = useState<ItemOption[]>([])
  const [selected, setSelected] = useState<ItemOption | null>(null)
  const [guesses, setGuesses] = useState<GuessResult[]>([])
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isInFFYL, setIsInFFYL] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null)

  return {
    options, setOptions,
    selected, setSelected,
    guesses, setGuesses,
    isGameWon, setIsGameWon,
    isGameLost, setIsGameLost,
    isInFFYL, setIsInFFYL,
    isLoading, setIsLoading,
    duplicateMessage, setDuplicateMessage
  }
}