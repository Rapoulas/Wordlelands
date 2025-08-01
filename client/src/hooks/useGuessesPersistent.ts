import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { encryptCookie } from '../utils/cookieUtils'

interface UseGuessesPersistenceProps {
  guesses: any[]
  isGuessesLoaded: boolean
}

export const useGuessesPersistent = ({ guesses, isGuessesLoaded }: UseGuessesPersistenceProps) => {
  useEffect(() => {
    if (!isGuessesLoaded) return
    const guessIds = guesses.map(({ selected, guessId }) => ({ itemId: selected.value, guessId }))
    const guessesString = JSON.stringify(guessIds)
    Cookies.set('guesses', encryptCookie(guessesString), { expires: 1 })
  }, [guesses, isGuessesLoaded])
}