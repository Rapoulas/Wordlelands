import cardImage from '../assets/card.png'
import CountdownTimer from './CountdownTimer'

interface LoseScreenProps {
  dailyImage: string
  dailyName: string
}

const LoseScreen: React.FC<LoseScreenProps> = ({
  dailyImage,
  dailyName
}) => {
  return (
    <div
      className="m-4 p-4 w-[524px] h-[396px] flex flex-col items-center justify-start text-white text-2xl bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${cardImage})` }}
    >
      <span className="mt-6 drop-shadow-lg text-outline">YOU LOST...</span>
      <span className="drop-shadow-lg text-outline">THE WEAPON WAS:</span>
      <div className={`w-24 h-24 justify-center text-center border-black flex flex-col items-center border-4 bg-[#b5b5b6] rounded-md`}>
        <img
          src={`http://localhost:5000${dailyImage}`}
          alt={dailyName}
          className="w-20 h-20 object-contain mb-1 mt-1"
        />
        <span className="text-sm text-black">{dailyName}</span>
      </div>
      <CountdownTimer/>
    </div>
  )
}

export default LoseScreen;