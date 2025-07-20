import { Tooltip } from 'react-tooltip';
import type { ItemOption } from './Home';
import type { ResultTristateCheck } from '../../../server/src';

interface WeaponGuessInputProps {
  guesses: { 
    selected: ItemOption; 
    result: {
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
  visibleRows: string[]
  animatedCells: { [key: string]: number }
  handleAnimationEnd: (guessId: string, cellIndex: number) => void
}

const GuessesGrid: React.FC<WeaponGuessInputProps> = ({
  guesses,
  visibleRows,
  animatedCells,
  handleAnimationEnd
}) => {
  return (
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
              data-tooltip-content="Which rarity the item shows up in (e.x.: Common, Epic)"
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
              data-tooltip-content="Which game the item is present in (e.x.: Borderlands 1, Borderlands The Pre-Sequel)"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Game" />
              —Game—
            </a>
            <a
              data-tooltip-id="Elements"
              data-tooltip-content="Which elements the item can spawn in (e.x.: Non-elemental, Shock, Fire)"
              className="text-center text-white py-2 border-b-4 border-t-4 border-white m-0.5 mb-4"
            >
              <Tooltip id="Elements" />
              —Elements—
            </a>
            <a
              data-tooltip-id="DLCs"
              data-tooltip-content="Which content this item came from in the games it is present at (e.x.: Base Game, Dragon Keep, Knoxx)"
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
                <div className={`grid-cell flex flex-col items-center border-4 border-black bg-[#b5b5b6] rounded-md ${animatedCells[`${guessId}-0`] ? 'no-animation' : ''}`} style={{ animationDelay: '0s' } as React.CSSProperties} onAnimationEnd={() => handleAnimationEnd(guessId, 0)}>
                  <img
                    src={`http://localhost:5000${selected.item.imageUrl}`}
                    alt={selected.item.name}
                    className="w-20 h-20 object-contain mb-1 mt-1"
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
  );
};

export default GuessesGrid;