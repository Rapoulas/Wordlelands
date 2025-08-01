import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { decryptCookie } from '../utils/cookieUtils'
import type { Item } from '../types'

interface UseGuessesLoaderProps {
  setGuesses: (guesses: any[]) => void
  setVisibleRows: (rows: string[]) => void
}

export const useGuessesLoader = ({ setGuesses, setVisibleRows }: UseGuessesLoaderProps) => {
  const [isGuessesLoaded, setIsGuessesLoaded] = useState(false)

  useEffect(() => {
    const loadGuesses = async () => {
      try {
        const savedGuesses = Cookies.get('guesses')
        if (savedGuesses) {
          const decrypted = decryptCookie(savedGuesses)
          if (!decrypted) {
            console.warn('invalid cookie, resetting')
            setGuesses([])
            setVisibleRows([])
            return
          }

          const guessIds: { itemId: number; guessId: string }[] = JSON.parse(decrypted)
          if (!Array.isArray(guessIds)) {
            console.warn('invalid cookie format, resetting')
            setGuesses([])
            setVisibleRows([])
            return
          }

          const itemsRes = await fetch('http://localhost:5000/api/items/select')
          const items: Item[] = await itemsRes.json()
          const newGuesses = []
          const newVisibleRows = []
          
          for (const { itemId, guessId } of guessIds) {
            const item = items.find(i => i.id === itemId)
            if (item) {
              const res = await fetch('http://localhost:5000/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedItem: item }),
              })
              const result = await res.json()
              newGuesses.push({
                selected: {
                  value: item.id,
                  label: item.name,
                  item,
                },
                result,
                guessId,
              })
              newVisibleRows.push(guessId)
            }
          }
          setGuesses(newGuesses)
          setVisibleRows(newVisibleRows)
        }
      } catch (err) {
        console.error('Error loading guesses from cookie:', err)
        setGuesses([])
      } finally {
        setIsGuessesLoaded(true)
      }
    }
    loadGuesses()
  }, [setGuesses, setVisibleRows])

  // Save guesses to cookies
  useEffect(() => {
    if (!isGuessesLoaded) return
    // This should be called from the parent component with guesses
  }, [isGuessesLoaded])

  return { isGuessesLoaded }
}