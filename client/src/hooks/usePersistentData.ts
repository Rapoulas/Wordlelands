import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { decryptCookie } from '../utils/cookieUtils'
import { encryptCookie } from '../utils/cookieUtils'

export const usePersistentData = () => {
  const [winStreak, setWinStreak] = useState(() => {
    const savedWinStreak = Cookies.get('winStreak')
    const decrypted = savedWinStreak ? decryptCookie(savedWinStreak) : null
    return decrypted && !isNaN(parseInt(decrypted, 10)) ? parseInt(decrypted, 10) : 0
  })

  const [lastResetDate, setLastResetDate] = useState(() => {
    const savedDate = Cookies.get('lastResetDate')
    const decrypted = savedDate ? decryptCookie(savedDate) : null
    return decrypted ? new Date(decrypted) : new Date()
  })

  const [lives, setLives] = useState(() => {
    const savedLives = Cookies.get('lives')
    const decrypted = savedLives ? decryptCookie(savedLives) : null
    return decrypted && !isNaN(parseInt(decrypted, 10)) ? parseInt(decrypted, 10) : 12
  })

  useEffect(() => {
    Cookies.set('lives', encryptCookie(lives.toString()), { expires: 1 })
  }, [lives])

  useEffect(() => {
    Cookies.set('winStreak', encryptCookie(winStreak.toString()), { expires: 30 })
  }, [winStreak])

  return {
    winStreak, setWinStreak,
    lastResetDate, setLastResetDate,
    lives, setLives
  }
}