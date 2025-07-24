import cardImage from '../assets/card.png'
import hpImage from '../assets/HP.png'
import Select from 'react-select'
import type { ItemOption } from './Home'
import type { JSX } from 'react'

interface WeaponGuessInputProps {
  options: ItemOption[]
  handleSelect: (option: ItemOption | null) => void
  formatOptionLabel: ({ label, item }: ItemOption) => JSX.Element
  duplicateMessage: string | null
  lives: number
}

const ItemSelection: React.FC<WeaponGuessInputProps> = ({
  options,
  handleSelect,
  formatOptionLabel,
  duplicateMessage,
  lives
}) => {
  return (
    <div
      className="m-4 p-4 w-[524px] h-[396px] flex flex-col items-center justify-start text-white text-2xl bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${cardImage})` }}
    >
      <span className="mt-12 drop-shadow-lg">GUESS TODAY'S WEAPON!</span>
      <div className="mt-2 flex justify-start space-x-1">
        <img src={hpImage} alt="Lives" className="w-6 h-6" />
        <span className="text-2xl text-white drop-shadow-lg text-outline">{lives}</span>
      </div>
      <Select
        options={options}
        value={null}
        onChange={handleSelect}
        formatOptionLabel={formatOptionLabel}
        placeholder="Search weapon name..."
        className="mt-2 w-full text-xl text-white"
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
      {duplicateMessage && (
        <div className="duplicate-message mt-5 text-red-400 text-lg drop-shadow-lg text-outline p-2 rounded-md">
          {duplicateMessage}
        </div>
      )}
    </div>
  )
}

export default ItemSelection;