import backgroundImage from '../assets/background.jpeg'
import logoImage from '../assets/logo.png'
import type { Item } from '../types'
import winSound from '../assets/LegendaryDrop.mp3'
import { useEffect, useState } from 'react'
import type {ResultTristateCheck} from '../../../server/src/index'
import { v4 as uuidv4 } from 'uuid'
import ItemSelection from './ItemSelection'
import WinScreen from './WinScreen'
import LoseScreen from './LoseScreen'
import GuessesGrid from './GuessesGrid'
import Cookies from 'js-cookie'
import { calculateTimeLeft } from './CountdownTimer'
import CryptoJS from 'crypto-js'

export interface ItemOption {
  value: number
  label: string
  item: Item
}

const COOKIE_SECRET = import.meta.env.COOKIE_KEY || 'secret-key-fallback';

const encryptCookie = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, COOKIE_SECRET).toString()
    const hmac = CryptoJS.HmacSHA256(encrypted, COOKIE_SECRET).toString()
    return `${encrypted} | ${hmac}`
  }
  catch (err) {
    console.error('Error encrypting cookies', err)
    return ''
  }
}

const decryptCookie = (cookie: string):string | null => {
  try {
    const [encrypted, hmac] = cookie.split(' | ')
    if (!encrypted || !hmac)
      return null
    
    const expectedHmac = CryptoJS.HmacSHA256(encrypted, COOKIE_SECRET).toString()
    if (hmac != expectedHmac) {
      console.log("hmac invalid")
      return null
    }

    const decrypted = CryptoJS.AES.decrypt(cookie, COOKIE_SECRET).toString(CryptoJS.enc.Utf8)
    return decrypted
  }
  catch (err) {
    console.error('Error decrypting cookie: ', err)
    return null
  }
}

const Home: React.FC = () => {
  const [options, setOptions] = useState<ItemOption[]>([])
  const [, setSelected] = useState<ItemOption | null>(null)
  const [isGameWon, setIsGameWon] = useState(false)
  const [guesses, setGuesses] = useState<
    { selected: ItemOption; result: {
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
    }[]
  >([])
  const [visibleRows, setVisibleRows] = useState<string[]>([])
  const [animatedCells, setAnimatedCells] = useState<{ [key: string]: number }>({})
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null)
  const [, setTimeLeft] = useState({hours: 0, minutes: 0, seconds: 0})
  const [isGameLost, setIsGameLost] = useState(false)
  const [isInFFYL, setIsInFFYL] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    const checkReset = () => {
      const now = new Date()
      const today = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      if (today > lastResetDate) {
        Cookies.remove('guesses')
        Cookies.remove('lives')
        Cookies.remove('winStreak')
        setGuesses([])
        setLives(12)
        setWinStreak(0)
        setLastResetDate(today)
        Cookies.set('lastResetDate', today.toISOString(), { expires: 7 })
      }
    };

    checkReset();
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
      checkReset()
    }, 1000);
    return () => clearInterval(timer)
  }, [lastResetDate])

  useEffect(() => {
    if (guesses.length > visibleRows.length) {
      setTimeout(() => {
        const newGuessId = guesses[0].guessId
        setVisibleRows([newGuessId, ...visibleRows])
      }, 200)
    }
  }, [guesses, visibleRows])

  useEffect(() => {
    if (guesses.length > 0 && guesses[0].result.isCorrect) {
      const audio = new Audio(winSound)
      audio.play().catch(err => console.error('Error playing win sound:', err))
      setIsGameWon(true)
    } 
  }, [guesses])

  useEffect(() => {
    if (duplicateMessage) {
      const timer = setTimeout(() => {
        setDuplicateMessage(null)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [duplicateMessage])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('http://localhost:5000/api/items/select')
        const data: Item[] = await res.json()
        setOptions(
          data.map(item => ({
            value: item.id,
            label: `${item.name}`,
            rarity: item.rarity,
            type: item.type,
            manufacturer: item.manufacturer,
            game: item.game,
            element: item.elements,
            redText: item.redText,
            dlc: item.dlc,
            item,
          }))
        )
        setIsLoading(false)
      } catch (err) {
        console.error('error fetching items', err)
        setIsLoading(false)
      }
    }
    fetchItems()
  }, [])

  useEffect(() => {
    if (lives == 0){
      //setIsInFFYL(true)
      setIsGameLost(true)
    }
  }, [lives])

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
        setIsLoading(false)
      }
    }
    loadGuesses()
  }, [])

  //Cookies
  useEffect(() => {
    const guessIds = guesses.map(({ selected, guessId }) => ({ itemId: selected.value, guessId }))
    const guessesString = JSON.stringify(guessIds)
    Cookies.set('guesses', encryptCookie(guessesString), { expires: 1 })
  }, [guesses])

  useEffect(() => {
    Cookies.set('lives', encryptCookie(lives.toString()), {expires: 1})
  }, [lives])

  useEffect(() => {
    Cookies.set('winStreak', encryptCookie(winStreak.toString()), {expires: 30})
  }, [winStreak])

  const checkItem = async (option: ItemOption | null) => {
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
        body: JSON.stringify({selectedItem: option.item})
      })

      const data = await res.json()

      setGuesses(prev => {
        const newGuesses = [{ selected: option, result: data, guessId: uuidv4() }, ...prev]
        return newGuesses
      })
      setSelected(null)
      if (!data.isCorrect && !isInFFYL){
        setLives(prev => prev-1)
      }

    } catch (err) {
      console.error('Error checking item:', err)
    }
  }

  const handleSelect = (option: ItemOption | null) => {
    setSelected(option)
    checkItem(option)
  }

  const formatOptionLabel = ({ label, item }: ItemOption) => (
    <div className="flex items-center">
      <img src={`http://localhost:5000${item.imageUrl}`} alt={label} className="w-[70px] mr-2.5" />
      <span>{label}</span>
    </div>
  )

  const handleAnimationEnd = (guessId: string, cellIndex: number) => {
    setAnimatedCells(prev => ({
      ...prev,
      [`${guessId}-${cellIndex}`]: 1,
    }))
  }

  return (
    <div
      className="min-h-screen bg-fixed flex flex-col items-center justify-start p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logoImage} alt="Logo" className="w-[512px] h-[128px] object-contain" />
      {isLoading ? (
          <div className="text-lg text-white text-outline">Loading...</div>
        ) : isGameWon && guesses.length > 0 ? (
        <WinScreen
            selected={guesses[0].selected.item}
          />
        ) : isGameLost && guesses.length > 0 ? (
          <LoseScreen 
            dailyImage={guesses[0].result.dailyImage}
            dailyName={guesses[0].result.dailyName}
          />
          ) : (
          <ItemSelection
            options={options}
            handleSelect={handleSelect}
            formatOptionLabel={formatOptionLabel}
            duplicateMessage={duplicateMessage}
            lives = {lives}
          />
        )
      }
      {isInFFYL ? (
        <div>
          FFYL
        </div>
        ) : null  

      }
      <GuessesGrid
        guesses={guesses}
        visibleRows={visibleRows}
        animatedCells={animatedCells}
        handleAnimationEnd={handleAnimationEnd}
      />
    </div>
  )
}

export default Home