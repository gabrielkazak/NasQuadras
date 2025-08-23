import React, { useEffect, useState } from 'react'
import './BestPlayers.css'
import PlayerCard from '../PlayerCard/PlayerCard'

const BestPlayers = () => {

  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchPlayers = async () =>{
      try{
        const response = await fetch('/api/players/top');
        const result = await response.json();
        setPlayers(result);
        setLoading(false);
      }catch(error){
        console.error(error);
        setError(true);
      }
    }

    fetchPlayers();
  },[])

  return (
    <div className='h-fit best-players sm:pt-20 text-center flex flex-col items-center pb-50'>
      <h2 className='text-white text-4xl'>OS <span className='text-amber-500'>100</span> MELHORES DA LIGA</h2>
      <div className='grid mt-10 mx-10 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5'>
        {loading &&
          <p>Carregando jogadores...</p>
        }
        {error &&
          <p>Falha ao buscar jogadores</p>
        }
        {players != null &&
          players.map((player)=>(
            <PlayerCard key={player.personId_nba} name={player.full_name} team={player.team} position={player.top_100} picture={player.headshot_url}/>
          ))
        }
      </div>
    </div>
  )
}

export default BestPlayers