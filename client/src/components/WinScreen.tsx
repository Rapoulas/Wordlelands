import cardImage from '../assets/card.png'
import type { Item } from '../types'
import CountdownTimer from './CountdownTimer'

const WinScreen: React.FC<{selected: Item}> = ({selected}) => {
  return (
    <div
      className="m-4 p-4 w-[524px] h-[396px] flex flex-col items-center justify-start text-white text-2xl bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${cardImage})` }}
    >
      <span className="mt-6 drop-shadow-lg text-outline">YOU WIN!</span>
      <span className="drop-shadow-lg text-outline">THE WEAPON WAS:</span>
      <div className={`w-24 h-24 justify-center text-center border-black flex flex-col items-center border-4 bg-[#e8e8e8] rounded-md`}>
        <img
          src={`http://localhost:5000${selected.imageUrl}`}
          alt={selected.name}
          className="w-22 h-22 object-contain mb-1"
        />
        <span className="text-sm text-black">{selected.name}</span>
      </div>
      <CountdownTimer/>
    </div>
  )
}

export default WinScreen;