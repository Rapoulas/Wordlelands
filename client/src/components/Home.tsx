import backgroundImage from '../assets/background.jpeg';
import logoImage from '../assets/logo.png';
import cardImage from '../assets/card.png';

const Home: React.FC = () => {
  return (
    <div className="text-shadow-lg/40 min-h-screen flex flex-col items-center justify-start pt-8" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <img src={logoImage} alt="logo" className="w-128 h-32 object-contain"></img>
      <div className="mt-16 p-8 w-[424px] h-[296px] flex flex-col items-center justify-start text-white text-2xl font-bold bg-contain bg-no-repeat bg-center" style={{ backgroundImage: `url(${cardImage})` }}>
        <span className="mt-12">Guess Today's Weapon!</span>
        <input type="text" id="simple-search" className="outline-[#1f1f22] outline-2 rounded-sm rounded-xlmt-16 mt-8 p-2 flex items-center justify-center text-white text-xl font-bold" placeholder="Search weapon name..."/>
      </div>
    </div>
  );
};

export default Home;