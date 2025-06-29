import cardImage from '../assets/card.png';
import Select from 'react-select';
import type { ItemOption } from './Home';
import type { JSX } from 'react';

interface WeaponGuessInputProps {
  options: ItemOption[];
  handleSelect: (option: ItemOption | null) => void;
  formatOptionLabel: ({ label, item }: ItemOption) => JSX.Element;
}

const ItemSelection: React.FC<WeaponGuessInputProps> = ({
  options,
  handleSelect,
  formatOptionLabel,
}) => {
  return (
    <div
      className="m-4 p-4 w-[524px] h-[396px] flex flex-col items-center justify-start text-white text-2xl font-bold bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${cardImage})` }}
    >
      <span className="mt-12 drop-shadow-lg text-outline">GUESS TODAY'S WEAPON!</span>
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
            '&:hover': { borderColor: '#1f1f22' },
          }),
          input: (base) => ({
            ...base,
            color: 'white',
          }),
          placeholder: (base) => ({
            ...base,
            color: 'white',
            opacity: 0.7,
          }),
          singleValue: (base) => ({
            ...base,
            color: 'white',
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1f1f22',
            borderRadius: '0.75rem',
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? '#2a2a2d' : '#1f1f22',
            color: 'white',
            padding: '0.5rem',
          }),
        }}
      />
    </div>
  );
};

export default ItemSelection;