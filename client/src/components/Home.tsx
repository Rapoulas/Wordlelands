import backgroundImage from '../assets/background.jpeg';
import logoImage from '../assets/logo.png';
import cardImage from '../assets/card.png';
import type { Item } from '../types';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import type {ResultTristateCheck} from '../../../server/src/index'
import { Tooltip } from 'react-tooltip'

interface ItemOption {
  value: number;
  label: string;
  item: Item;
}

const Home: React.FC = () => {
  const [options, setOptions] = useState<ItemOption[]>([])
  const [selected, setSelected] = useState<ItemOption | null>(null)
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
    } }[]
  >([]);
  const [visibleRows, setVisibleRows] = useState<number[]>([])

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
      setGuesses([...guesses, { selected: option, result: data }]); 
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

  return (
    <div
      className="min-h-screen bg-fixed flex flex-col items-center justify-start p-4 bg-cover bg-center h-[200vh]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logoImage} alt="Logo" className="w-[512px] h-[128px] object-contain" />
      <div
        className="m-4 p-4 w-[524px] h-[396px] flex flex-col items-center justify-start text-white text-2xl font-bold bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${cardImage})` }}
      >
        <span className="mt-12 drop-shadow-lg">GUESS TODAY'S WEAPON!</span>
        <Select
          options={options}
          value={null}
          onChange={handleSelect}
          formatOptionLabel={formatOptionLabel}
          placeholder="Search weapon name..."
          className="mt-8 w-full text-xl text-white font-bold"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1f1f22',
              borderColor: '#1f1f22',
              borderRadius: '0.75rem',
              padding: '0.5rem',
              color: 'white',
              boxShadow: 'none',
              '&:hover': { borderColor: '#1f1f22' }
            }),
            input: (base) => ({
              ...base,
              color: 'white'
            }),
            placeholder: (base) => ({
              ...base,
              color: 'white',
              opacity: 0.7
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white'
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#1f1f22',
              borderRadius: '0.75rem'
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? '#2a2a2d' : '#1f1f22',
              color: 'white',
              padding: '0.5rem'
            })
          }}
        />
      </div>
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
              data-tooltip-id="Elements"
              data-tooltip-content="Which elements the weapon can spawn in"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="DLCs" />
              —DLC—
            </a>
          </div>
        </div>
        <div>
          {guesses.map(({ selected, result }, idx) =>(
            <div key={idx} className="grid grid-cols-7 gap-2 w-full mb-2 text-center items-center text-black">
              <div className="grid-cell flex flex-col items-center border-4 border-black bg-gray-400 rounded-md" style={{ animationDelay: '0s' } as React.CSSProperties} >
                <img
                  src={`http://localhost:5000${selected.item.imageUrl}`}
                  alt={selected.item.name}
                  className="w-22 h-22 object-contain mb-1"
                />
                <span className="text-sm text-black">{selected.item.name}</span>
              </div>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isRarityCorrect == 'Correct' ? 'bg-green-500' : result.isRarityCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '0.5s' } as React.CSSProperties}>{selected.item.rarity}</span>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isTypeCorrect == 'Correct' ? 'bg-green-500' : result.isTypeCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '1s' } as React.CSSProperties}>{selected.item.type}</span>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isManufacturerCorrect == 'Correct' ? 'bg-green-500' : result.isManufacturerCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '1.5s' } as React.CSSProperties}>{selected.item.manufacturer}</span>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isGameCorrect == 'Correct' ? 'bg-green-500' : result.isGameCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '2s' } as React.CSSProperties}>{selected.item.game}</span>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isElementsCorrect == 'Correct' ? 'bg-green-500' : result.isElementsCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '2.5s' } as React.CSSProperties}>{selected.item.elements}</span>
              <span className={`grid-cell text-sm border-4 border-black rounded-md ${result.isDLCCorrect == 'Correct' ? 'bg-green-500' : result.isDLCCorrect === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ animationDelay: '3s' } as React.CSSProperties}>{selected.item.dlc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;