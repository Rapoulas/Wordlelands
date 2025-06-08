import backgroundImage from '../assets/background.jpeg';
import logoImage from '../assets/logo.png';
import cardImage from '../assets/card.png';
import type { Item } from '../types';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface ItemOption {
  value: number;
  label: string;
  item: Item;
}

const Home: React.FC = () => {
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [selected, setSelected] = useState<ItemOption | null>(null);
  const [result, setResult] = useState<{ isCorrect: boolean; dailyId: number; dailyImage: string } | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/items/select')
      .then(res => res.json())
      .then((data: Item[]) => setOptions(data.map(item => ({
        value: item.id,
        label: `${item.name}`,
        item
      }))))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const checkItem = async (option: ItemOption | null) => {
    if (!option) return;
    try {
      const res = await fetch('http://localhost:5000/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedId: option.value })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error checking item:', err);
    }
  };

  const handleSelect = (option: ItemOption | null) => {
    setSelected(option);
    checkItem(option);
  };

  const formatOptionLabel = ({ label, item }: ItemOption) => (
    <div className="flex items-center">
      <img src={`http://localhost:5000${item.imageUrl}`} alt={label} className="w-[70px] mr-2.5" />
      <span>{label}</span>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img src={logoImage} alt="Logo" className="w-[512px] h-[128px] object-contain" />
      <div
        className="mt-16 p-8 w-[424px] h-[296px] flex flex-col items-center justify-start text-white text-2xl font-bold bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${cardImage})` }}
      >
        <span className="mt-12 drop-shadow-lg">Guess Today's Weapon!</span>
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
        {result && (
          <div className="mt-4 text-center">
            <p className={`text-lg ${result.isCorrect ? 'text-green-500' : 'text-red-500'} drop-shadow-lg`}>
              {result.isCorrect ? 'Correct!' : `Wrong! Daily item ID: ${result.dailyId}`}
            </p>
            {!result.isCorrect && (
              <div className="mt-2">
                <img src={`http://localhost:5000${result.dailyImage}`} alt="Daily Item" className="w-24 mx-auto" />
                {selected && (
                  <div className="mt-2 text-sm text-white">
                    <h3 className="text-base font-bold">Your Pick:</h3>
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