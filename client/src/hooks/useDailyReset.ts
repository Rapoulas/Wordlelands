import { useEffect } from 'react'
import Cookies from 'js-cookie'

interface UseDailyResetProps {
  lastResetDate: Date
  setLastResetDate: (date: Date) => void
  setGuesses: (guesses: any[]) => void
  setLives: (lives: number) => void
  setWinStreak: (streak: number) => void
}

export const useDailyReset = ({
  lastResetDate,
  setLastResetDate,
  setGuesses,
  setLives,
  setWinStreak
}: UseDailyResetProps) => {
  useEffect(() => {
    const checkReset = () => {
      const now = new Date()
      const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      if (today > lastResetDate) {
        // Reset all game data
        Cookies.remove('guesses')
        Cookies.remove('lives')
        Cookies.remove('winStreak')
        setGuesses([])
        setLives(12)
        setWinStreak(0)
        setLastResetDate(today)
        Cookies.set('lastResetDate', today.toISOString(), { expires: 7 })
      }
    }

    // Check reset immediately and every minute
    checkReset()
    const timer = setInterval(checkReset, 60000) // Check every minute instead of every second
    
    return () => clearInterval(timer)
  }, [lastResetDate, setLastResetDate, setGuesses, setLives, setWinStreak])
}