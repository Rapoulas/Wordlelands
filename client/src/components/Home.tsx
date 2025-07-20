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

export interface ItemOption {
  value: number;
  label: string;
  item: Item;
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
  const [lives, setLives] = useState(6)
  const [isGameLost, setIsGameLost] = useState(false)

  useEffect(() => {
    if (guesses.length > visibleRows.length) {
      setTimeout(() => {
        const newGuessId = guesses[0].guessId;
        setVisibleRows([newGuessId, ...visibleRows])
      }, 200)
    }
  }, [guesses, visibleRows])

  useEffect(() => {
    if (guesses.length > 0 && guesses[0].result.isCorrect) {
      const audio = new Audio(winSound);
      audio.play().catch(err => console.error('Error playing win sound:', err));
      setIsGameWon(true)
    } else if (guesses.length > 0 && !guesses[0].result.isCorrect && lives === 0) {
      setIsGameLost(true)
    }
  }, [guesses]);

  useEffect(() => {
    if (duplicateMessage) {
      const timer = setTimeout(() => {
        setDuplicateMessage(null)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [duplicateMessage])

  useEffect(() => {
    fetch('http://localhost:5000/api/items/select')
      .then(res => res.json())
      .then((data: Item[]) => setOptions(data.map(item => ({
        value: item.id,
        label: `${item.name}`,
        rarity: item.rarity,
        type: item.type,
        manufacturer: item.manufacturer,
        game: item.game,
        element: item.elements,
        redText: item.redText,
        dlc: item.dlc,
        item
      }))))
      .catch(err => console.error('Error fetching items:', err))
  }, [])

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
      setGuesses([{ selected: option, result: data, guessId: uuidv4()}, ...guesses]); 
      setSelected(null);
      if (!data.isCorrect){
        setLives(prev => prev-1)
      }
    } catch (err) {
      console.error('Error checking item:', err)
    }
  };

  const handleSelect = (option: ItemOption | null) => {
    setSelected(option)
    checkItem(option)
  };

  const formatOptionLabel = ({ label, item }: ItemOption) => (
    <div className="flex items-center">
      <img src={`http://localhost:5000${item.imageUrl}`} alt={label} className="w-[70px] mr-2.5" />
      <span>{label}</span>
    </div>
  );

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
      {isGameWon ? (
        <WinScreen
            selected={guesses[0].selected.item}
          />
        ) : isGameLost ? (
          <LoseScreen dailyItem={guesses[0].result} />
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
      <GuessesGrid
        guesses={guesses}
        visibleRows={visibleRows}
        animatedCells={animatedCells}
        handleAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

export default Home;