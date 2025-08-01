import backgroundImage from '../assets/background.jpeg'
import logoImage from '../assets/logo.png'
import { useEffect, useState } from 'react'
import ItemSelection from './ItemSelection'
import WinScreen from './WinScreen'
import LoseScreen from './LoseScreen'
import GuessesGrid from './GuessesGrid'
import { useItems } from '../hooks/useItems'
import { usePersistentData } from '../hooks/usePersistentData'
import { useGameLogic } from '../hooks/useGameLogic'
import { useGameAnimation } from '../hooks/useGameAnimation'
import { useGuessesLoader } from '../hooks/useGuessesLoader'
import { useGuessesPersistent } from '../hooks/useGuessesPersistent'
import { useDailyReset } from '../hooks/useDailyReset'
import type { ItemOption } from '../hooks/useGameState'

const Home: React.FC = () => {
  const { options, isLoading } = useItems()
  const { winStreak, setWinStreak, lastResetDate, setLastResetDate, lives, setLives } = usePersistentData()
  
  // Game states
  const [, setSelected] = useState<ItemOption | null>(null)
  const [isGameWon, setIsGameWon] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isInFFYL, setIsInFFYL] = useState(false)
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<any[]>([])

  const { visibleRows, setVisibleRows, animatedCells, handleAnimationEnd } = useGameAnimation(guesses)

  const { isGuessesLoaded } = useGuessesLoader({ setGuesses, setVisibleRows })

  useGuessesPersistent({ guesses, isGuessesLoaded })

  useDailyReset({
    lastResetDate,
    setLastResetDate,
    setGuesses,
    setLives,
    setWinStreak
  })

  const { handleSelect } = useGameLogic({
    guesses,
    setGuesses,
    setSelected,
    setDuplicateMessage,
    setLives,
    isGameWon,
    isGameLost,
    isInFFYL
  })

  useEffect(() => {
    if (guesses.length > 0 && guesses[0].result.isCorrect) {
      setIsGameWon(true)
    }
  }, [guesses])

  useEffect(() => {
    if (lives === 0) {
      setIsGameLost(true)
    }
  }, [lives])

  useEffect(() => {
    if (duplicateMessage) {
      const timer = setTimeout(() => setDuplicateMessage(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [duplicateMessage])

  const formatOptionLabel = ({ label, item }: ItemOption) => (
    <div className="flex items-center">
      <img src={`http://localhost:5000${item.imageUrl}`} alt={label} className="w-[70px] mr-2.5" />
      <span>{label}</span>
    </div>
  )

  return (
    <div
      className="min-h-screen bg-fixed flex flex-col items-center justify-start p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logoImage} alt="Logo" className="w-[512px] h-[128px] object-contain" />
      
      {isLoading ? (
        <div className="text-lg text-white text-outline animate-pulse">Loading...</div>
      ) : isGameWon && guesses.length > 0 ? (
        <WinScreen 
          selected={guesses[0].selected.item}
          winStreak={winStreak}
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
          lives={lives}
        />
      )}
      
      {isInFFYL && <div>FFYL</div>}
      
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