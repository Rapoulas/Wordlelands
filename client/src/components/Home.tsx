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
  const [result, setResult] = useState<{
    isCorrect: boolean,
    isRarityCorrect: ResultTristateCheck;
    isTypeCorrect: ResultTristateCheck;
    isManufacturerCorrect: ResultTristateCheck; 
    isGameCorrect: ResultTristateCheck;  
    isElementsCorrect: ResultTristateCheck;
    dailyId: number;
    dailyImage: number;
  } | null>(null)         // use this to check if items are partially correctt

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
        item
      }))))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const checkItem = async (option: ItemOption | null) => {
    if (!option) return
    try {
      const res = await fetch('http://localhost:5000/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({selectedItem: option.item})
      })
      const data = await res.json()
      setResult(data)
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
          value={selected}
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
      <div className="m-4 p-4 bg-black border-4 border-amber-400 min-h-10 min-w-200 flex flex-col">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 cursor-pointer w-full"> {/* Grid with 2 columns */}
            <a
              data-tooltip-id="Item"
              data-tooltip-content="Name of the Item"
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Item" />
              Item
            </a>
            <a
              data-tooltip-id="Rarity"
              data-tooltip-content="Name of the many possible rarities (e.x.: Common, Epic)"
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Rarity" />
              Rarity
            </a>
            <a
              data-tooltip-id="Type"
              data-tooltip-content="Type of the item (e.x.: Assault Rifle, Pistol) "
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Type" />
              Type
            </a>
            <a
              data-tooltip-id="Manufacturer"
              data-tooltip-content="Name of the manufacturer (e.x.: Jakobs, Hyperion)"
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Manufacturer" />
              Manufacturer
            </a>
            <a
              data-tooltip-id="Game"
              data-tooltip-content="Which game the weapon is present in"
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Game" />
              Game
            </a>
            <a
              data-tooltip-id="Elements"
              data-tooltip-content="Which elements the weapon can spawn in"
              className="text-center text-white px-4 py-2 border-b-4 border-black m-0.5 mb-4"
            >
              <Tooltip id="Elements" />
              Elements
            </a>
          </div>
        </div>

        {result && (
          <div>
            <p className={`text-lg ${result.isCorrect ? 'text-green-500' : 'text-red-500'} drop-shadow-lg`}>
              {result.isCorrect ? 'Correct!' : `Wrong! Daily item ID: ${result.dailyId}`}
            </p>
            {!result.isCorrect && (
              <div className="mt-6">
                <img src={`http://localhost:5000${result.dailyImage}`} alt="Daily Item" className="w-24 mx-auto" />
                {selected && (
                  <div className="mt-2 text-xl text-white">
                    <h3 className="text-base">Your Pick:</h3>
                    <img src={`http://localhost:5000${selected.item.imageUrl}`}></img>
                    <p><strong>Name:</strong> {selected.item.name}</p>
                    <p><strong>Rarity:</strong> {selected.item.rarity}</p>
                    <p><strong>Type:</strong> {selected.item.type}</p>
                    <p><strong>Manufacturer:</strong> {selected.item.manufacturer}</p>
                    <p><strong>Game:</strong> {selected.item.game}</p>
                    <p><strong>Elements:</strong> {selected.item.elements}</p>
                    <p><strong>Red Text:</strong> {selected.item.redText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </div>
    </div>
  );
};

export default Home;