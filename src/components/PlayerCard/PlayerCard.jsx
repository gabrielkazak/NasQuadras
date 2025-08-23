import { useEffect, useState } from 'react'
import './PlayerCard.css'
import useTeam from '../../hooks/useTeam';


const PlayerCard = ({ name, team, position, picture }) => {
  const [isHovered, setIsHovered] = useState(false);

  const words = team.split(" ");
  const teamName = words[words.length - 1];
  const { data: teamObject, isLoading } = useTeam(teamName);
  const [favoriteText, setFavoriteText] = useState('Favoritar');
  const [displayRemove, setDisplayRemove] = useState('block');

  useEffect(()=>{
    if(position == ''){
      setFavoriteText('Excluir')
    }
  },[position])


  const addToFavorite = async (playerName) => {
    let favoritePlayers = localStorage.getItem('favoritePlayers') || '';
    const favoriteList = favoritePlayers.split(',').map(p => p.trim());

    if (favoriteList.includes(playerName)) {
      setFavoriteText('Já adicionado');
      return;
    }

    const updatedList = [...favoriteList, playerName];
    const playersFormated = updatedList.join(',');

    try {
      const response = await fetch('/api/user/players', { 
        method:'PATCH', 
        body: JSON.stringify({ favoritePlayers: playersFormated }), 
        headers: { 'Content-Type': 'application/json' },
        credentials:'include'
      });
      const result = await response.json();

      setFavoriteText("✔Adicionado");
      localStorage.setItem('favoritePlayers', result.favoritePlayers || playersFormated);
    } catch(error) {
      setFavoriteText('Falha');
      console.error(error)
    }
  }





  const removeFromFavorite = async (playerName) => {
    let favoritePlayers = localStorage.getItem('favoritePlayers') || '';
    const favoriteList = favoritePlayers.split(',').map(p => p.trim());

    if (!favoriteList.includes(playerName)){
      return;
    }

    const updatedList = favoriteList.filter(player => player !== playerName);
    const playersFormated = updatedList.join(',');

    try {
      const response = await fetch('/api/user/players', { 
        method:'PATCH', 
        body: JSON.stringify({ favoritePlayers: playersFormated }), 
        headers: { 'Content-Type': 'application/json' },
        credentials:'include'
      });
      const result = await response.json();
      setDisplayRemove('none');
      localStorage.setItem('favoritePlayers', result.favoritePlayers || playersFormated);
    } catch(error) {
      setFavoriteText('Falha');
      console.error(error)
    }
  }


  return (
    <div
      className='group player-card h-80 w-64 mt-20 rounded transform hover:scale-105 transition duration-500 shadow-sm shadow-gray-700'
      style={{
        display:displayRemove,
        backgroundColor: isLoading
          ? 'gray'
          : isHovered && teamObject?.color1
          ? teamObject.color1
          : ''
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {position != "" 
        ?
        <div className='flex justify-between m-5'>
          {<p className='border-4 border-amber-500 rounded-full size-10 pt-1 text-center text-white'>{position}</p>}
          <button
            className='opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                      border-2 border-amber-500 p-2 text-white rounded 
                      hover:bg-gray-500 cursor-pointer 
                      transition duration-300 ease-in-out'
            onClick={()=>addToFavorite(name)}
          >
            {favoriteText}
          </button>
        </div>
        :
         <div className='flex justify-center m-5'>
          <button
            className='opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                      border-2 border-amber-500 p-2 text-white rounded 
                      hover:bg-gray-500 cursor-pointer 
                      transition duration-300 ease-in-out'
            onClick={()=>removeFromFavorite(name)}
          >
            {favoriteText}
          </button>
        </div>
      }

      
      
      <img className='w-full h-2/3 object-cover' src={picture} alt={name} />
      <div className='background-color rounded-b w-full h-25 flex flex-col items-start justify-center pl-4'>
        <p className='text-white'>{name}</p>
        <p className='text-amber-700'>{team}</p>
      </div>
    </div>
  );
}

export default PlayerCard;
