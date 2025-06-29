import backgroundImage from '../assets/background.jpeg'
import logoImage from '../assets/logo.png'
import type { Item } from '../types'
import { useEffect, useState } from 'react'
import type {ResultTristateCheck} from '../../../server/src/index'
import { Tooltip } from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid'
import ItemSelection from './ItemSelection'
import WinScreen from './WinScreen'

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
      }
      guessId: string
    }[]
  >([])
  const [visibleRows, setVisibleRows] = useState<string[]>([])
  const [animatedCells, setAnimatedCells] = useState<{ [key: string]: number }>({})

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
      setIsGameWon(true);
    }
  }, [guesses]);

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
    if (!option) return
    try {
      const res = await fetch('http://localhost:5000/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({selectedItem: option.item})
      })
      const data = await res.json()
      setGuesses([{ selected: option, result: data, guessId: uuidv4()}, ...guesses]); 
      setSelected(null); 
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
      className="min-h-screen bg-fixed flex flex-col items-center justify-start p-4 bg-cover bg-center h-[200vh]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logoImage} alt="Logo" className="w-[512px] h-[128px] object-contain" />
        {isGameWon ? (
          <WinScreen
              selected={guesses[0].selected.item}
            />
          ) : (
            <ItemSelection
              options={options}
              handleSelect={handleSelect}
              formatOptionLabel={formatOptionLabel}
            />
          )
        }
      <div className="m-4 p-4 bg-[#20252c] border-4 border-amber-600 min-h-10 w-192 flex flex-col items-center rounded-md">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 cursor-pointer w-full">
            <a
              data-tooltip-id="Item"
              data-tooltip-content="Name of the Item"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Item" />
              —Item—
            </a>
            <a
              data-tooltip-id="Rarity"
              data-tooltip-content="Name of the many possible rarities (e.x.: Common, Epic)"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Rarity" />
              —Rarity—
            </a>
            <a
              data-tooltip-id="Type"
              data-tooltip-content="Type of the item (e.x.: Assault Rifle, Pistol)"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Type" />
              —Type—
            </a>
            <a
              data-tooltip-id="Manufacturer"
              data-tooltip-content="Name of the manufacturer (e.x.: Jakobs, Hyperion)"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Manufacturer" />
              —Manufacturer—
            </a>
            <a
              data-tooltip-id="Game"
              data-tooltip-content="Which game the weapon is present in"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Game" />
              —Game—
            </a>
            <a
              data-tooltip-id="Elements"
              data-tooltip-content="Which elements the weapon can spawn in"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Elements" />
              —Elements—
            </a>
            <a
              data-tooltip-id="DLCs"
              data-tooltip-content="Which content this weapon came from in the games it is present at"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="DLCs" />
              —DLC—
            </a>
          </div>
        </div>
        <div>
          {guesses.map(({ selected, result, guessId }) =>
            visibleRows.includes(guessId) ? (
              <div key={guessId} className="grid grid-cols-7 gap-2 w-full mb-2 text-center items-center text-black">
                <div className={`grid-cell flex flex-col items-center border-4 border-black bg-[#e8e8e8] rounded-md ${animatedCells[`${guessId}-0`] ? 'no-animation' : ''}`} style={{ animationDelay: '0s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 0)}>
                  <img
                    src={`http://localhost:5000${selected.item.imageUrl}`}
                    alt={selected.item.name}
                    className="w-22 h-22 object-contain mb-1"
                  />
                  <span className="text-sm text-black">{selected.item.name}</span>
                </div>
                <span className={`${animatedCells[`${guessId}-1`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isRarityCorrect == 'Correct' ? 'bg-green-500' : result.isRarityCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '0.3s' } as React.CSSProperties } onAnimationEnd={() => handleAnimationEnd(guessId, 1)}>{selected.item.rarity}</span>
                <span className={`${animatedCells[`${guessId}-2`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isTypeCorrect == 'Correct' ? 'bg-green-500' : result.isTypeCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '0.6s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 2)}>{selected.item.type}</span>
                <span className={`${animatedCells[`${guessId}-3`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isManufacturerCorrect == 'Correct' ? 'bg-green-500' : result.isManufacturerCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '0.9s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 3)}>{selected.item.manufacturer}</span>
                <span className={`${animatedCells[`${guessId}-4`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isGameCorrect == 'Correct' ? 'bg-green-500' : result.isGameCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '1.2s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 4)}>{selected.item.game}</span>
                <span className={`${animatedCells[`${guessId}-5`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isElementsCorrect == 'Correct' ? 'bg-green-500' : result.isElementsCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '1.5s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 5)}>{selected.item.elements}</span>
                <span className={`${animatedCells[`${guessId}-6`] ? 'no-animation' : ''} grid-cell text-sm border-4 border-black rounded-md ${result.isDLCCorrect == 'Correct' ? 'bg-green-500' : result.isDLCCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '1.8s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 6)}>{selected.item.dlc}</span>
              </div>
            ): null
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;